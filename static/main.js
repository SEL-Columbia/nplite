$(function(){

var map = L.map('map').setView([40.809400, -73.960029], 16);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


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

$('.upload').click(function(){
        doStuff(TEST_CSV);
    });

var layers = [];

function doStuff(csv){
    $('.status').text('Loading CSV');

    var nodes = nodesFromCSV(csv);
    var nodeMap = {};
    _.each(nodes, function(node){
        nodeMap[node.id] = node;
    });
    map.setView([nodes[0].lat, nodes[0].lon], 8);

    for (var i=0, node; node=nodes[i]; i++){
        //L.marker([node.lat, node.long]).addTo(map);
    }

    L.geoJson(GEOJSON).addTo(map);

    var worker = new Worker('/static/worker.js');

    worker.addEventListener('message', function(e){
        var msg = e.data;
        if (msg.cmd == 'status'){
            $('.status').text(msg.text);
        } else if (msg.cmd == 'add_edge'){
            var edge = msg.edge;
            var node_a = nodeMap[edge.a];
            var node_b = nodeMap[edge.b];
            L.polyline([
                L.latLng(node_a.lat, node_a.lon),
                L.latLng(node_b.lat, node_b.lon)], {color: 'red'}).addTo(map);
        }
    }, false);

    worker.postMessage(nodes);
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


});