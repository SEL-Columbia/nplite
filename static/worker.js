self.importScripts('/static/worker-libs.js');


self.addEventListener('message', function(e){
    var msg = e.data;
    var tree = rbush();
    Network.minimumSpanningTree(msg.nodes);
}, false);

console = {};
console.log = function(s){
    self.postMessage({
        cmd: 'debug',
        data: s
    });
}

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
        cmd: 'status',
        text: 'Generating Edges'
    });
    var startTime = (new Date).getTime();


    function btree(){
        var edges = new buckets.BSTree(function(a, b){
            return a.weight - b.weight;
        });
        for (var i=0, node_a; node_a=nodes[i]; i++){
            for (var j=i+1, node_b; node_b=nodes[j]; j++){
                edges.add({
                    a: node_a.id,
                    b: node_b.id,
                    weight: Network.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
                });
            }
        }
        return edges;
    }


    function array(){
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
            cmd: 'status',
            text: 'Sorting Edges'
        });

        edges.sort(function(a, b){
            return a.weight - b.weight;
        });
        return edges;
    }

    function wtf(){
        var edges = new SortedList();
        for (var i=0, node_a; node_a=nodes[i]; i++){
            for (var j=i+1, node_b; node_b=nodes[j]; j++){
                edges.add({
                    a: node_a.id,
                    b: node_b.id,
                    weight: Network.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
                });
            }
        }
        return edges;
    }

    function rbtree(){
        var edges = new BinTree(function(a, b){
            return a.weight - b.weight;
        });
        for (var i=0, node_a; node_a=nodes[i]; i++){
            for (var j=i+1, node_b; node_b=nodes[j]; j++){
                edges.insert({
                    a: node_a.id,
                    b: node_b.id,
                    weight: Network.distanceFromPoint(node_a.lat, node_a.lon, node_b.lat, node_b.lon)
                });
            }
        }
        edges.forEach = edges.each;
        return edges;
    }
    
    var edges = wtf();
    //var edges = array();
    //var edges = btree();
    //var edges = rbtree();

    var forest = {};
    _.each(nodes, function(node){
        forest[node.id] = [node.id];
    });

    self.postMessage({
        cmd: 'status',
        text: 'Drawing Tree cX'
    });

    console.log((new Date).getTime() - startTime);

    var i = 0;
    var edges2 = [];

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
            edges2.push(edge);
        }
    });

    self.postMessage({cmd: 'status', text: 'added'});
    console.log((new Date).getTime() - startTime);


    edges2.forEach(function(edge){
        edge.left = null;
        edge.right = null;
        self.postMessage({
                    cmd: 'add_edge',
                    edge: edge
                });
    });


    console.log('i:', i);
    console.log((new Date).getTime() - startTime);

    self.postMessage({cmd: 'status', text: 'Finished'});
};



var SortedList = function(){
    // Sorted list of nodes using BTree
    // Adapted from:
    // https://github.com/nzakas/computer-science-in-javascript
    this.root = null;
};

SortedList.prototype.add = function(node){
    node.left = null;
    node.right = null;

    if (this.root === null){
        this.root = node;
        return;
    } 

    var current = this.root;
    while (true){
        var cmp = node.weight - current.weight;
        if (cmp < 0){
            if (current.left === null){
                current.left = node;
                break;
            } else {                    
                current = current.left;
            }
        } else if (cmp > 0){
            if (current.right === null){
                current.right = node;
                break;
            } else {                    
                current = current.right;
            }       
        } else {
            return;
        }
    }
};

SortedList.prototype.forEach = function(cb){
    function inOrder(node){
        if (node){
            if (node.left !== null){
                inOrder(node.left);
            }
            cb(node);
            if (node.right !== null){
                inOrder(node.right);
            }
        }
    }
    inOrder(this.root);    
};


SortedList.prototype.forEach2 = function(cb){
    var current = this.root;
    var stack = [this.root];
    while (stack.length || current) {
        if (current){
            stack.push(current);
            current = current.left;
        } else {
            current = stack.pop();
            cb(current);
            current = current.right;
        }
    }
};



