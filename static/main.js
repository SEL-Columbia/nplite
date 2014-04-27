$(function(){

var map = L.map('map', {zoomControl: false}).setView([40.809400, -73.960029], 16);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

var worker = new Worker('/static/worker.js');
var nodeMap = {};

worker.addEventListener('message', function(e){
    var msg = e.data;
    if (msg.type === 'status'){
        $('.status').text(msg.text);
    } else if (msg.type === 'debug'){
        console.log(JSON.stringify(msg.data));
    } else if (msg.type === 'add_edge'){
        var edge = msg.edge;
        var node_a = nodeMap[edge.a];
        var node_b = nodeMap[edge.b];
        L.polyline([
            [node_a.lat, node_a.lon],
            [node_b.lat, node_b.lon]], {color: 'orange', weight: 2}).addTo(map);
    } else if (msg.type === 'add_points'){
        msg.points.forEach(function(point){
            L.circle([point[0], point[1]], 50, {fillOpacity: 1, stroke: false, color: 'red'})
                .addTo(map);
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
            doStuff(csv);
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
                doStuff(csv[0], geojson[0]);
            });
    });


function doStuff(csv, geojson){
    $('.status').text('Loading CSV/GeoJSON');
    var nodes = nodesFromCSV(csv);
    _.each(nodes, function(node){
        nodeMap[node.id] = node;
    });
    map.setView([nodes[0].lat, nodes[0].lon], 8);

    for (var i=0, node; node=nodes[i]; i++){
        L.circle([node.lat, node.lon], 100, {fillOpacity: 1, stroke: false, color: 'green'}).addTo(map);
    }

    L.geoJson(geojson).addTo(map);

    worker.postMessage({
        type: 'init',
        nodes: nodes,
        paths: geojson
    });

    worker.postMessage({
        type: 'lines',
        lines: linesFromGeoJSON(geojson)
    });
}



function nodesFromCSV(str){
    var csv = str.split(/[\r\n|\n]+/);
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
}


function linesFromGeoJSON(json){
    var lines = [];
    json.features.forEach(function(feature){
        if (feature.geometry.type === 'LineString'){
            lines.push(feature.geometry.coordinates);
        }
    });
    return lines;
}



});