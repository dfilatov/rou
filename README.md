Rou
===

Url-based router for Node.js and browsers.

Getting Started
---------------
###In the Node.js###
You can install using Node Package Manager (npm):

    npm install rou

###In the Browsers###
```html
<script type="text/javascript" src="rou.min.js"></script>
```
Also RequireJS module format supported.

API
---
````javascript
var router = Rou();

router
    .when('/objects/{oid}/slaves/{sid}')
        .method('get') // method should be 'get'
        .param('new', true) // param 'new' should be
        .param('category', false) // param 'category' shouldn't be
        .param('bounds') // param 'bounds' should be non-empty
        .param('geometry', 'polyline') // param 'bounds' should be 'polyline'
        .param('type', ['road', 'railway']) // param 'type' should be 'road' or 'railway'
        .param('oid', /^\d+$/) // param 'oid' should be integer
        .then(function(req) { // controller action
            // req.query.oid, req.query.sid now available
            // controller action
        })
    .when('/objects/new')
        .then('/objects', { new : 1 }) // rewrite /objects/new to /objects/?new=1
    .when('/objects/{type}')
        .param('type', ['road', 'railway'])
        .then('/objects') // rewrite /objects/road or /objects/railway to /objects/?type=road or /objects/?type=railway
    .otherwise(function() {
        show404();
    });
    
router.route({
    method : 'get',
    path   : '/objects/road',    
    query  : { new : '1' }    
});
````
