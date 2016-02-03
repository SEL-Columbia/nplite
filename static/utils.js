Network.generateNetworkQuad = function(){
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
