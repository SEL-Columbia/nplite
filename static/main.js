$(function(){
L_PREFER_CANVAS = true;

    Main.init();
});

Main = {};
Main.init = function(){
    var self = this;

    // Initialize map
    self.map = L.map('map', {zoomControl: false, zoomAnimation: false, inertia: false})
        .setView([40.809400, -73.960029], 16)
        .on('click', function(e){
            console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
            return false;
        });
    /*
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(self.map);
    */
    L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg", {
            attribution: '<a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains:'1234'
        }).addTo(self.map);


    new L.Control.Zoom({ position: 'bottomright' }).addTo(self.map);


    // Start worker
    self.worker = new Worker('/static/worker.js');
    self.worker.addEventListener('message', function(e){
        var msg = e.data;
        Main[msg.rpc](msg.data);
    }, false);

    // Controls
    $('.network')
        .click(function(){
            $('.status').text('Loading Example');
            $.when(
                $.get('/static/examples/705.csv'),
                $.getJSON('/static/examples/705.geojson'))
                .done(function(csv, geojson){
                    self.drawNetwork(csv[0], geojson[0]);
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

Main.drawNetwork = function(csv, geojson){
    var self = this;
    var nodes = self.nodesFromCSV(csv);
    var nodePoints = [];

    $('.status').text('Loading CSV/GeoJSON');

    nodes.forEach(function(node){
        nodePoints.push([node.lat, node.lon]);
        L.circle([node.lat, node.lon], 100, {fillOpacity: 1, stroke: false, color: 'green'})
            .addTo(self.map);
    });

    self.map.fitBounds(nodePoints);
    return self.d3layer(nodes);
    
    self.worker.postMessage({rpc: 'loadNodes', data: nodes});

    if (geojson){
        var lines = self.linesFromGeoJSON(geojson);
        lines.forEach(function(line){
            L.polyline(line, {color: 'blue'}).addTo(self.map);
        });
        L.geoJson(geojson).addTo(self.map);
        self.worker.postMessage({rpc: 'loadLines', data: lines});
    }

    self.worker.postMessage({rpc: 'generateNetwork'});
};

Main.d3layer = function(nodes){
    var self = this;
    var center0 = self.map.latLngToLayerPoint(self.map.getCenter());
    var originalBounds = self.map.getPixelBounds();
    var originalOrigin = self.map.getPixelOrigin();
    var center = self.map.getCenter();
    var size = self.map.getSize();
    var overlay = self.map.getPanes().overlayPane;
    var firstOrigin = self.map.getPixelOrigin();
    var svg = d3.select(overlay)
        .append('svg')
        .attr('width', size.x)
        .attr('height', size.y)
        .attr('class', 'leaflet-zoom-hide')
    var g = svg.append('g');
    var projection = d3.geo.mercator()
        .center([center.lng, center.lat])
        .scale((1 << 8 + self.map.getZoom()) / 2 / Math.PI)
        .translate([size.x/2, size.y/2]);
    var path = d3.geo.path().projection(projection);

    var features = [];
    nodes.forEach(function(node){
        var coordinates = projection([node.lon, node.lat]);
        //console.log(node.lon, node.lat)
        g.append('svg:circle')
            .attr('cx', coordinates[0])
            .attr('cy', coordinates[1])
            .attr('r', 1);

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [node.lon, node.lat]
            }
        });
    });

/*
    g.selectAll('path')
        .data(features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr('class', 'node');
*/

    self.map.on('viewreset', reset);
    self.map.on('moveend', reset);

    function reset(){
        var center = self.map.latLngToLayerPoint(self.map.getCenter());
        var bounds = self.map.getPixelBounds();
        var size = self.map.getSize();
        var origin = self.map.getPixelOrigin();
        var scale = Math.round(origin.x / originalOrigin.x * 10) / 10;
        var ddx = center0.x - center.x;
        var ddy = center0.y - center.y; 
        var offset = self.map.containerPointToLayerPoint([0, 0]);

        console.log(offset)

        // Reverse leaflet CSS transform of SVG pane
        //svg.attr('style', '-webkit-transform:translate(' + -dx + 'px,' + -dy + 'px)');
        L.DomUtil.setPosition($('svg')[0], offset);

        console.log(ddx, ddy, scale)
        // Apply SVG transform on G element instead
        var gx = ((-size.x / 2) * (scale - 1)) + offset.x;
        var gy = (-size.y / 2) * (scale - 1) + offset.y;
        var gx = -offset.x * (scale);
        var gy = -offset.y * (scale );
        g.attr('transform', 'translate(' + gx + ',' + gy + ')scale(' + scale + ',' + scale + ')');
    }
    reset();
};


Main.status = function(text){
    $('.status').text(text);
};

Main.debug = function(obj){
    console.log(obj);
};

Main.drawEdge = function(edge){
    L.polyline(edge.points, {color: 'orange', weight: 2})
        .addTo(this.map);
};

Main.drawNodes = function(nodes){
    var self = this;
    nodes.forEach(function(node){
        var color = node.type === 'grid' ? 'red' : 'green';
        L.circle([node.lat, node.lon], 50, {fillOpacity: 1, stroke: false, color: color})
            .addTo(self.map);
    });
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


