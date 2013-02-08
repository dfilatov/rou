var connect = require('connect'),
    url = require('url'),
    Rou = require('../../lib/router'),
    app = connect(),
    router = Rou();

app
    .use(connect.query())
    .use(function(req, res, next) {
        req.path = url.parse(req.url).pathname;
        next();
    })
    .use(router.route.bind(router))
    .listen(3000);

router
    .when('/objects/{id}')
        .param('id', /^\d+$/)
        .then(function(req, res) {
            res.end([req.method, req.path, JSON.stringify(req.query)].join('\n'));
        })
    .when('/objects')
        .then('/objects/1')
    .otherwise(function(req, res) {
        res.statusCode = 404;
        res.end('404');
    });