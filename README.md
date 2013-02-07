rou
===

Router

````javascript
var router = Rou();

router
    .when('/objects/{oid}/slaves/{sid}')
        .method('get') // method should be 'get'
        .param('new') // param 'new' should be        
        .param('bounds', true) // param 'bounds' should be non-empty
        .param('geometry', 'polyline') // param 'bounds' should be 'polyline'
        .param('type', ['road', 'railway']) // param 'type' should be 'road' or 'railway'
        .param('oid', /^\d+$/) // param 'oid' should be integer
        .then(function(req) { // controller action
            // req.query.oid, req.query.sid now available
            // controller action
        })
    .when('/objects/new')
        .then('/objects', { new : 1 }) // rewrite to /objects/?new=1
    .when('/objects/{type}')
        .param('type', 'road')
        .then('/objects') // rewrite to /objects/?type=road
    .otherwise(function() {
        show404();
    });
````
