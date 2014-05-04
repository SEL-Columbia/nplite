self.importScripts('/static/worker-libs.js');


self.addEventListener('message', function(e){
    var msg = e.data;
    Network[msg.rpc](msg.data);
}, false);

function rpc(rpc, data){
    self.postMessage({rpc: rpc, data: data});
};

var debugI = 0;
function debug(msg, interval){
    if (!interval || debugI % interval === 0){
        rpc('debug', msg);
    }
    debugI++;
}


Network = {
    lastId: 0, 
    nodes: [],
    rtree: rbush(9, ['.lon', '.lat', '.lon', '.lat'])
};

Network.loadNodes = function(nodes){
    rpc('status', 'Adding Nodes...');
    var self = this;
    nodes.forEach(function(node){
        node.id = Network.lastId++;
        node.connected = node.type === 'grid' ? true : false;
        self.nodes.push(node);
    });
    self.rtree.load(nodes);
};

Network.loadLines = function(lines){
    // Converts lines into points (nodes)
    rpc('status', 'Adding Lines...');
    var points = this.linesToPoints(lines);
    var nodes = [];
    points.forEach(function(point){
        nodes.push({
            lat: point[0],
            lon: point[1],
            type: 'grid'
        });
    });
    this.loadNodes(nodes);
    rpc('status', 'Drawing Nodes...');
    rpc('drawNodes', nodes);
    rpc('status', 'Done');
};

Network.generateNetwork = function(){
    rpc('status', 'Generating Network...');
    var self = this;
    var visited = {};

    var queue = [];
    this.nodes.forEach(function(node){
        queue.push(node);
    });

    rpc('status', 'Building Edges...');
    var edges = [];
    var connected = {};
    while (queue.length){
        var node = queue.shift();
        if (visited[node.id] || node.type === 'grid') continue;

        var neighbors = this.getNeighbors(node, 10);
        //debug(neighbors, 100);
        debug(queue.length, 100);

        neighbors.forEach(function(neighbor){
            if (node === neighbor || neighbor.type === 'grid' || connected[node.id + ',' + neighbor.id]) return;
            var edge = self.generateEdge(node, neighbor);
            connected[node.id + ',' + neighbor.id] = true;
            connected[neighbor.id + ',' + node.id] = true;
            edges.push(edge);
        });
    }
    self.minimumSpanningTree(edges);
};

Network.getNeighbors = function(node, distance){
    var sw = {
        lat: this.endPoint(node.lat, node.lon, 180, distance)[0],
        lon: this.endPoint(node.lat, node.lon, 270, distance)[1]
    };
    var ne = {
        lat: this.endPoint(node.lat, node.lon, 0, distance)[0],
        lon: this.endPoint(node.lat, node.lon, 90, distance)[1]
    };
    return this.rtree.search([sw.lon, sw.lat, ne.lon, ne.lat]);
};

Network.generateEdge = function(start, end){
    var self = this;

    // Find neighboring nodes
    var sw = {
        lat: Math.min(start.lat, end.lat),
        lon: Math.min(start.lon, end.lon)
    };
    var ne = {
        lat: Math.max(start.lat, end.lat),
        lon: Math.max(start.lon, end.lon)
    };
    var neighbors = this.rtree.search([sw.lon, sw.lat, ne.lon, ne.lat]);

    // Find cheapest path to end node
    var points = [[start.lat, start.lon]];
    var curr = start;
    var weight = 0;
    while (true){
        var changed = false;
        var endWeight = weight + self.edgeWeight(curr, end);
        neighbors.forEach(function(node){
            if (curr === node || node.type !== 'grid') return;
            var pathWeight = weight + self.edgeWeight(curr, node) +
                ((node === end) ? 0 : self.edgeWeight(node, end));

            if (pathWeight < endWeight){
                weight = pathWeight;
                curr = node;
                points.push([curr.lat, curr.lon]);
                changed = true;
            }
        });
        if (!changed){
            weight = endWeight;
            points.push([end.lat, end.lon]);
            break;
        }
    }

    return {
        a: start.id,
        b: end.id,
        points: points,
        weight: weight
    };
};

Network.edgeWeight = function(node1, node2){
    var savings = 1;
    if (node1.type === 'grid')
        savings -= 0.45;
    if (node2.type === 'grid')
        savings -= 0.45;
    var weight = this.distBetweenPoints(node1.lat, node1.lon, node2.lat, node2.lon);
    return weight * savings;
};

Network.minimumSpanningTree = function(edges){
    // Kruskal's Algorithm
    // http://architects.dzone.com/articles/algorithm-week-kruskals
    rpc('status', 'Sorting Edges');

    edges.sort(function(a, b){
        return a.weight - b.weight;
    });

    rpc('status', 'Drawing Network');

    var forest = {};
    this.nodes.forEach(function(node){
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
            rpc('drawEdge', edge);
        }
    });
    rpc('status', 'Finished');
};


// Utils
Network.linesToPoints = function(lines){
    // Quick approximation of points on a line
    var self = this;
    var points = [];
    var interval = 1;
    lines.forEach(function(line){
        for (var i=0, p1, p2; p1=line[i]; i++){
            if (p2=line[i+1]){
                var dist = self.distanceFromPoint(p1[0], p1[1], p2[0], p2[1]);
                var nSplits = Math.floor(dist / interval);
                var splitLat = (p2[0] - p1[0]) / nSplits;
                var splitLon = (p2[1] - p1[1]) / nSplits;
                var linePoints = [p1];
                for (var j=0; j < nSplits; j++){
                    linePoints.push([j * splitLat + p1[0], j * splitLon + p1[1]]);
                }
                linePoints.push(p2);
                // Update list in place
                points.push.apply(points, linePoints);
            }
        }
    });
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
    bearing = this.degToRad(bearing);
    var lat2 = Math.asin(
        Math.sin(lat) * Math.cos(distance/R) + 
        Math.cos(lat) * Math.sin(distance/R) * Math.cos(bearing));
    var lon2 = lon + Math.atan2(
        Math.sin(bearing) * Math.sin(distance/R) * Math.cos(lat), 
        Math.cos(distance/R) - Math.sin(lat) * Math.sin(lat2));
    return [lat2, lon2];
};

Network.endPoint = function(lat, lon, brng, dist) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var θ = this.degToRad(brng);
    var δ = dist / 6371; // angular distance in radians

    var φ1 = this.degToRad(lat);
    var λ1 = this.degToRad(lon);

    var φ2 = Math.asin( Math.sin(φ1)*Math.cos(δ) +
                        Math.cos(φ1)*Math.sin(δ)*Math.cos(θ) );
    var λ2 = λ1 + Math.atan2(Math.sin(θ)*Math.sin(δ)*Math.cos(φ1),
                             Math.cos(δ)-Math.sin(φ1)*Math.sin(φ2));
    λ2 = (λ2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return [this.radToDeg(φ2), this.radToDeg(λ2)];
}

Network.getBoundingBox = function(){
    var node = this.nodes[0];
    if (!node) return;
    var sw = {lat: node.lat, lon: node.lon};
    var ne = {lat: node.lat, lon: node.lon};
    this.nodes.forEach(function(node){
        sw.lat = Math.min(sw.lat, node.lat);
        sw.lon = Math.min(sw.lon, node.lon);
        ne.lat = Math.max(ne.lat, node.lat);
        ne.lon = Math.max(ne.lon, node.lon);
    });
    return [sw, ne];
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

Network.distBetweenPoints = function(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var φ1 = this.degToRad(lat1)
    var λ1 = this.degToRad(lon1);
    var φ2 = this.degToRad(lat2)
    var λ2 = this.degToRad(lon2);
    var Δφ = φ2 - φ1;
    var Δλ = λ2 - λ1;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

Network.degToRad = function(deg){
    return deg * Math.PI / 180;
};

Network.radToDeg = function(rad){
    return rad * 180 / Math.PI;
};



