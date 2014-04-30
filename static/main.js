$(function(){
    Main.init();
});


Main = {};
Main.init = function(){
    var self = this;
    self.nodeMap = {};

    // Initialize map
    self.map = L.map('map', {zoomControl: false})
        .setView([40.809400, -73.960029], 16)
        .on('click', function(e){
            console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
            return false;
        });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(self.map);
    new L.Control.Zoom({ position: 'bottomright' }).addTo(self.map);

    // Start worker
    self.worker = new Worker('/static/worker.js');
    self.worker.addEventListener('message', function(e){
        var msg = e.data;
        if (msg.type === 'status'){
            $('.status').text(msg.text);
        } else if (msg.type === 'debug'){
            console.log(JSON.stringify(msg.data));
        } else if (msg.type === 'add_edge'){
            self.addEdge(msg.edge);
        } else if (msg.type === 'add_points'){
            msg.points.forEach(function(point){
                L.circle([point[0], point[1]], 50, {fillOpacity: 1, stroke: false, color: 'red'})
                    .addTo(self.map);
            });
        }
    }, false);


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

    $('.network')
        .click(function(){
            $('.status').text('Loading Example');
            $.when(
                $.get('/static/examples/nodes.csv'),
                $.getJSON('/static/examples/paths.geojson'))
                .done(function(csv, geojson){
                    self.drawNetwork(csv[0], geojson[0]);
                });
        });
};

Main.drawNetwork = function(csv, geojson){
    var self = this;
    var nodes = self.nodesFromCSV(csv);
    var nodePoints = [];

    $('.status').text('Loading CSV/GeoJSON');

    nodes.forEach(function(node){
        self.nodeMap[node.id] = node;
        nodePoints.push([node.lat, node.lon]);
    });

    self.map.fitBounds(nodePoints);

    nodes.forEach(function(node){
        L.circle([node.lat, node.lon], 100, {fillOpacity: 1, stroke: false, color: 'green'})
            .addTo(self.map);
    });

    self.worker.postMessage({
        type: 'init',
        nodes: nodes,
        paths: geojson
    });

    if (geojson){
        var lines = self.linesFromGeoJSON(geojson);
        console.log(lines);
        lines.forEach(function(line){
            L.polyline(line, {color: 'blue'}).addTo(self.map);
        });


        //L.geoJson(geojson).addTo(self.map);
        self.worker.postMessage({
            type: 'lines',
            lines: lines
        });
    }
};

Main.addEdge = function(edge){
    var node_a = this.nodeMap[edge.a];
    var node_b = this.nodeMap[edge.b];
    L.polyline(edge.points, {color: 'orange', weight: 2})
        .addTo(this.map);
};

Main.nodesFromCSV = function(csv){
    var csv = csv.split(/[\r\n|\n]+/);
    var wgs84 = "+proj=longlat +zone=29 +ellps=WGS84 +datum=WGS84 +no_defs"
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
        if (typeof node.id == 'undefined'){
            node.id = i;
        }
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


