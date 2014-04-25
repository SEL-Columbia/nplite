self.importScripts('/static/worker-libs.js');


self.addEventListener('message', function(e){
    var nodes = e.data;
    var tree = rbush(9);
    Network.minimumSpanningTree(nodes);
}, false);



var Network = {};
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
    var dLon = (lon2 - lon1).toRad();
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return Math.atan2(y, x).toDeg();
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
Network.minimumSpanningTree = function(nodes){
    // Kruskal's Algorithm
    // http://architects.dzone.com/articles/algorithm-week-kruskals

    self.postMessage({
        cmd: 'status',
        text: 'Generating Edges'
    });

    var edges = [];
    for (var i=0, node_a; node_a=nodes[i]; i++){
        for (var j=i+1, node_b; node_b=nodes[j]; j++){
            edges.push({
                a: node_a.id,
                b: node_b.id,
                weight: this.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
            });
        }
    }

    self.postMessage({
        cmd: 'status',
        text: 'Sorting Edges'
    });

    edges.sort(function(a, b){
        return a.weight - b.weight;
    });

    var forest = {};
    _.each(nodes, function(node){
        forest[node.id] = node.id;
    });

    self.postMessage({
        cmd: 'status',
        text: 'Drawing Tree'
    });

    _.each(edges, function(edge){
        // If both edge vertices are in different sets, combine them
        if (forest[edge.a] !== forest[edge.b]){
            var a_value = forest[edge.a];
            var b_value = forest[edge.b];
            _.each(forest, function(value, id){
                if (value === b_value){
                    forest[id] = a_value;
                }
            });
            // Add edge to tree
            self.postMessage({
                cmd: 'add_edge',
                edge: edge
            });
        }
    });

    self.postMessage({
        cmd: 'status',
        text: 'Finished'
    });
};


