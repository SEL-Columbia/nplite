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
        self.postMessage({
            type: 'add_points',
            points: Network.linesToPoints(msg.lines)
        });
    }
}, false);



Network = {};
Network.linesToPoints = function(lines){
    var points = [];
    lines.forEach(function(line){
        for (var i=0, p1, p2; p1=line[i]; i++){
            if (p2=line[i]){
                var linePoints = Network.lineToPoints(p1[0], p1[1], p2[0], p2[1], 0.0001);
                points.push.apply(points, linePoints);
            }
        }
    });
    return points;
};

Network.linesToPoints2 = function(lines, interval){
    // Quick approximation of points on a line
    var self = this;
    var points = [];
    var interval = interval || 0.0001;
    lines.forEach(function(line){
        for (var i=0, p1, p2; p1=line[i]; i++){
            if (p2=line[i]){
                var d = self.distanceFromPoint(p1[0], p1[1], p2[0], p2[1]);
                var nSplits = Math.floor(d / interval);
                var splitLat = (p1[0] - p2[0]) / nSplits;
                var splitLon = (p1[1] - p2[1]) / nSplits;
                var linePoints = [p1];
                for (var j=0; j < nSplits; j++){
                    linePoints.push([j * splitLat + p1[0], j * splitLon + p2[0]]);
                }
                // Update list in place
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
    var points = [[lat1, lon1]];
    for (var i=1, d; d=i*interval && d<=distance; i++){
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
                points: [[node_a.lat, node_a.lon], [node_b.lat, node_b.lon]],
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


Network.generateNetwork = function(nodes, lines){
    // Node set up
    nodes.forEach(function(node){
        node.type = 'community';
        node.connected = false;
    });
    var points = this.linesToPoints(lines);
    points.forEach(function(point){
        nodes.push({
            type: 'grid',
            lat: point[0],
            lon: point[1],
            connected: true
        });
    });

    // For each power node find closest unconnected community nodes
    nodes.forEach(function(node){
        if (node.type === 'grid'){
            var neighbors = [];
            nodes.forEach(function(node2){
                if (node !== node2 && node2.type === 'community' && node2.connected === false){
                    neighbors.push(node2);
                }
            });

            neighbors.each(function(neighbor){
                Network.connectNode(neighbor, nodes);
            });
        }
    });
};


Network.connectNode = function(start, nodes){
    var visited = {};
    var edge = [];

    // Find closest connected node
    var currNode = null, currWeight;
    nodes.forEach(function(node){
        if (start !== node && node.connected){
            var weight = Network.calculateWeight(start, node);
            if (currNode === null || currWeight < weight && !visited[node.id]){
                currNode = node;
                currWeight = weight;
                visited[node.id] = true;
            }
        }
    });

    if (closest){
        var closed = false;

        while (!closed){

        }
    }

};


Network.calculateWeight = function(node1, node2){
    var savings = 1;
    if (node1.type === 'grid')
        savings -= 0.25;
    if (node2.type === 'grid')
        savings -= 0.25;
    var weight = Network.distanceFromPoint(node1.lat, node1.lon, node2.lat, node2.lon);
    return weight * savings;
};


