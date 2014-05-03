self.importScripts('/static/worker-libs.js');


self.addEventListener('message', function(e){
    var msg = e.data;
    Network[msg.rpc](msg.data);
}, false);

function rpc(rpc, data){
    self.postMessage({rpc: rpc, data: data});
};


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
        node.connected = node.type === 'network' ? true : false;
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
            type: 'network'
        });
    });
    this.loadNodes(nodes);
    rpc('status', 'Drawing Nodes...');
    rpc('drawNodes', nodes);
    rpc('status', 'Done');
};

Network.linesToPoints = function(lines){
    // Quick approximation of points on a line
    var self = this;
    var points = [];
    var interval = 1;
    lines.forEach(function(line){
        for (var i=0, p1, p2; p1=line[i]; i++){
            if (p2=line[i+1]){
                var d = self.distanceFromPoint(p1[0], p1[1], p2[0], p2[1]);
                var nSplits = Math.floor(d / interval);
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
    var lat2 = Math.asin(
        Math.sin(lat) * Math.cos(distance/R) + 
        Math.cos(lat) * Math.sin(distance/R) * Math.cos(brng));
    var lon2 = lon + Math.atan2(
        Math.sin(bearing) * Math.sin(distance/R) * Math.cos(lat1), 
        Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2));
    return [lat2, lon2];
};

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


Network.generateNetwork = function(){
    // Simple test to split network generation into quadrants
    rpc('status', 'Generating Edges...');

    //return this.minimumSpanningTree(this.nodes);

    var bbox = this.getBoundingBox();
    var sw = bbox[0];
    var ne = bbox[1];
    var split = 4;
    var dLat = (ne.lat - sw.lat) / split;
    var dLon = (ne.lon - sw.lon) / split;
    var network = [];
    for (var lat=sw.lat; lat < ne.lat; lat += dLat){
        for (var lon=sw.lon; lon < ne.lon; lon += dLon){
            var bbox = [lon, lat, lon + dLon, lat + dLat];
            var nodes = this.rtree.search(bbox);
            var edges = this.generateEdges(nodes);
            network = network.concat(edges);
        }
    }
    // rpc('debug', network);

    this.minimumSpanningTree(network);
};

Network.generateEdges = function(nodes){
    var edges = [];    
    for (var i=0, node_a; node_a=nodes[i]; i++){
        for (var j=i+1, node_b; node_b=nodes[j]; j++){
            edges.push({
                a: node_a.id,
                b: node_b.id,
                points: [[node_a.lat, node_a.lon], [node_b.lat, node_b.lon]],
                weight: this.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
            });
        }
    }
    return edges;
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






