# NPLite: A network planner experiment


## Front-end Responsibilities
- Drawing map/network
- Parsing CSV and converting to nodes objects with lat/lon `{lat: 90, lon: 90}`
- Parsing GeoJSON and converting to a list of points `[[lat, lon], ...]`
- Sending data to Worker
- Loading/saving GeoJSON to/from Server


## Front-end Worker Resonsibilities 
- Data storage: Community Nodes, Roads, Existing Networks
- Network building
- Queries based on bounding box


## Server Responsibilities
- Scenario GeoJSON storage

