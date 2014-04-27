self.importScripts('/static/worker-libs.js');

console = {};
console.log = function(data){
    self.postMessage({
        type: 'debug',
        data: JSON.stringify(data)
    });
};


self.addEventListener('message', function(e){
    var msg = e.data;
    if (msg.type === 'init'){
        Network.minimumSpanningTree(msg.nodes);
    } else if (msg.type === 'lines'){
        var points = Network.linesToPoints(msg.lines);
        self.postMessage({
            type: 'add_points',
            points: points
        });
    }
}, false);



var Network = {};
Network.linesToPoints = function(lines){
    var points = [];
    lines.forEach(function(line){
        for (var i=0, p1, p2; p1=line[i]; i++){
            if (p2=line[i]){
                var linePoints = Network.lineToPoints(p1[1], p1[0], p2[1], p2[0]);
                points.push.apply(points, linePoints);
            }
        }
    });
    return points;
};

Network.lineToPoints = function(lat1, lon1, lat2, lon2, interval){
    // Splits a line into multiple points
    // interval: distance in km
    var bearing = this.getBearing(lat1, lon1, lat2, lon2);
    var distance = this.distanceFromPoint(lat1, lon1, lat2, lon2);
    var points = [];
    for (var i=0, d; d=i*interval && d<=distance;i++){
        var point = this.pointFromBearing(lat1, lon1, bearing, d);
        points.push(point);
    }
    points.push([lat2, lon2]);
    return points;
};

Network.getBearing = function(lat1, lon1, lat2, lon2){
    // http://www.movable-type.co.uk/scripts/latlong.html
    var dLon = this.degToRad(lon2 - lon1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return this.radToDeg(Math.atan2(y, x));
};

Network.pointFromBearing = function(lat, lon, bearing, distance){
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371;
    var lat2 = Math.asin(
        Math.sin(lat) * Math.cos(distance/R) + 
        Math.cos(lat) * Math.sin(distance/R) * Math.cos(brng));
    var lon2 = lon + Math.atan2(
        Math.sin(bearing) * Math.sin(distance/R) * Math.cos(lat1), 
        Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2));
    return [lat2, lon2];
};

Network.distanceFromPoint = function(lat1, lon1, lat2, lon2){
    // http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
    var R = 6371; // Radius of the earth in km    
    var dLat = this.degToRad(lat2 - lat1);
    var dLon = this.degToRad(lon2 - lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
};

Network.degToRad = function(deg){
    return deg * Math.PI / 180;
};

Network.radToDeg = function(rad){
    return rad * 180 / Math.PI;
};

Network.generateNodeEdges = function(nodes){
    
};

Network.generateRoadPoints = function(geojson){

};

Network.generatePowerlines = function(nodes, points){

};

Network.minimumSpanningTree = function(nodes){
    // Kruskal's Algorithm
    // http://architects.dzone.com/articles/algorithm-week-kruskals

    self.postMessage({
        type: 'status',
        text: 'Generating Edges'
    });
    var startTime = (new Date).getTime();

    var edges = [];
    for (var i=0, node_a; node_a=nodes[i]; i++){
        for (var j=i+1, node_b; node_b=nodes[j]; j++){
            edges.push({
                a: node_a.id,
                b: node_b.id,
                weight: Network.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
            });
        }
    }

    self.postMessage({
        type: 'status',
        text: 'Sorting Edges'
    });

    edges.sort(function(a, b){
        return a.weight - b.weight;
    });

    self.postMessage({
        type: 'status',
        text: 'Drawing Tree'
    });

    var forest = {};
    _.each(nodes, function(node){
        forest[node.id] = [node.id];
    });

    edges.forEach(function(edge){
        var set_a = forest[edge.a];
        var set_b = forest[edge.b];

        // If both edge vertices are in different sets
        if (set_a !== set_b){
            // Combine sets
            set_a.push.apply(set_a, set_b);
            set_b.forEach(function(id){
                forest[id] = set_a;
            });
            // Add edge to tree
            self.postMessage({
                type: 'add_edge',
                edge: edge
            });
        }
    });

    console.log((new Date).getTime() - startTime);

    self.postMessage({type: 'status', text: 'Finished'});
};





