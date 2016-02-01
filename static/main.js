$(function(){
    Main.init();
});

Main = {
    totNodes: 0
};
Main.init = function(){
    var self = this;

    // Initialize map
    self.map = L.map('map', {zoomControl: false, zoomAnimation: false, inertia: false})
        .setView([40.809400, -73.960029], 16)
        .on('click', function(e){
            console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
            return false;
        });
    L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg", {
            attribution: '<a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: '1234'
        }).addTo(self.map);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(self.map);


    // Start worker
    self.worker = new Worker('static/worker.js');
    self.worker.addEventListener('message', function(e){
        var msg = e.data;
        Main[msg.rpc].apply(Main, msg.args);
    }, false);

    // Controls
    $('.network')
        .click(function(){
            $('.status').text('Loading Example');
            $.when(
                $.get('static/examples/705.csv'),
                $.getJSON('static/examples/705.geojson'),
                $.getJSON('static/examples/705coastline.geojson'))
                .done(function(csv, geojson, coastline){
                    self.drawNetwork(csv[0], geojson[0], coastline[0]);
                });
        });

    // Map Events
    $('#map')
        .on('dragenter', function(e){
            $(this).css('border', '2px solid #0B85A1');
            return false;
        })
        .on('dragover', function(e){
            return false;
        })
        .on('drop', function(e){
            $(this).css('border', 'none');
            var files = e.originalEvent.dataTransfer.files;
            var reader = new FileReader();
            reader.onload = function(e){
                csv = reader.result;
                self.drawNetwork(csv);
            };
            reader.readAsText(files[0]);
            return false;
        });
};

Main.drawNetwork = function(csv, geojson, coastline){
    var self = this;
    var nodes = self.nodesFromCSV(csv);
    var nodePoints = [];

    $('.status').text('Loading CSV/GeoJSON');

    nodes.forEach(function(node){
        nodePoints.push([node.lat, node.lon]);
    });

    self.map.fitBounds(nodePoints);
    self.initD3Layer();

    self.drawNodes(nodes);
    
    self.worker.postMessage({rpc: 'loadNodes', data: nodes});

    if (geojson){
        var lines = self.linesFromGeoJSON(geojson);
        lines.forEach(function(line){
            self.drawLine(line, 'grid');
        });
        self.worker.postMessage({rpc: 'loadGrid', data: lines});
    }

    if (coastline){
        var lines = self.linesFromGeoJSON(coastline);
        lines.forEach(function(line){
            self.drawLine(line, 'coast');
        });
        self.worker.postMessage({rpc: 'loadCoastline', data: lines});
    }

    self.worker.postMessage({rpc: 'generateNetwork'});
};

Main.initD3Layer = function(){
    var self = this;
    var center = self.map.getCenter();
    var size = self.map.getSize();
    var overlay = self.map.getPanes().overlayPane;
    var bounds = self.map.getBounds()
    self.dLat = bounds.getNorth() - bounds.getSouth();
    self.initialScale = (1 << 8 + self.map.getZoom()) / 2 / Math.PI;
    self.projection = d3.geo.mercator()
        .center([center.lng, center.lat])
        .scale(self.initialScale)
        .translate([size.x/2, size.y/2]);
    self.path = d3.geo.path().projection(self.projection);
    self.svg = d3.select(overlay)
        .append('svg')
        .attr('width', size.x)
        .attr('height', size.y);
    self.g = self.svg.append('g');

    self.updateSVG = function(){
        var size = self.map.getSize();
        var bounds = self.map.getBounds();
        var dLat = bounds.getNorth() - bounds.getSouth();
        var scale = Math.round(self.dLat / dLat * 10) / 10;
        var offset = self.map.containerPointToLayerPoint([0, 0]);
        var centerLatLon = self.map.getCenter()
        var center = self.projection([centerLatLon.lng, centerLatLon.lat]);

        // Reverse leaflet CSS transform of SVG pane
        L.DomUtil.setPosition(self.svg.node(), offset);

        // Apply SVG transform on G element instead
        var gx = -center[0] * scale + (size.x / 2);
        var gy = -center[1] * scale + (size.y / 2);
        self.g.attr('transform', 'translate(' + gx + ',' + gy + ')scale(' + scale + ',' + scale + ')');
    }

    self.map.on('viewreset', self.updateSVG);
    self.map.on('moveend', self.updateSVG);
};



Main.status = function(text){
    $('.status').text(text);
};

Main.debug = function(obj){
    console.log(obj);
};

Main.drawLine = function(points, cls){
    cls = cls || '';
    var coordinates = [];
    points.forEach(function(point){
        coordinates.push([point[1], point[0]]);
    });

    this.g
        .append('path')
        .datum({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        })
        .attr('d', this.path)
        .attr('class', 'edge ' + cls);
};

Main.drawNodes = function(nodes){
    var self = this;
    self.totNodes += nodes.length;
    nodes.forEach(function(node){
        var coordinates = self.projection([node.lon, node.lat]);
        self.g.append('svg:circle')
            .attr('cx', coordinates[0])
            .attr('cy', coordinates[1])
            .attr('r', 0.5)
            .attr('class', 'node');
    });
    self.updateSVG();
};

Main.nodesFromCSV = function(csv){
    var csv = csv.split(/[\r\n|\n]+/);
    var wgs84 = "+proj=longlat +zone=29 +ellps=WGS84 +datum=WGS84 +no_defs";
    var proj = csv[0].indexOf('PROJ.4 ') === 0 ? csv.shift().replace('PROJ.4 ', '') : null;
        proj = proj ? proj4(proj, wgs84) : null;
    var headers = csv.shift().toLowerCase().split(',');

    var nodes = [];
    for (var i=0, line; line=csv[i]; i++){
        var values = line.split(',');
        var node = {};
        for (var j=0, value; value=values[j]; j++){
            node[headers[j]] = value;
        }
        nodes.push(node);
    }

    // Projection conversions
    for (var i=0, node; node=nodes[i]; i++){
        if (proj){
            var latLon = proj.forward([parseInt(node.x), parseInt(node.y)]);
            node.lat = latLon[0];
            node.lon = latLon[1];
        } else {
            node.lat = parseFloat(node.lat);
            node.lon = parseFloat(node.lon);
        }
    }
    return nodes;
};


Main.linesFromGeoJSON = function(json){
    var lines = [];
    json.features.forEach(function(feature){
        if (feature.geometry.type === 'LineString'){
            var coordinates = [];
            feature.geometry.coordinates.forEach(function(point){
                coordinates.push([point[1], point[0]]);
            });
            lines.push(coordinates);
        }
    });
    return lines;
};


