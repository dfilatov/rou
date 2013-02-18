var http = require('http'),
    url = require('url'),
    Rou = require('../../lib/router'),
    router = Rou()
        .when('/objects/{id}')
            .param('id', /^\d+$/)
            .then(function(req, res) {
                res.end([req.method, req.path, JSON.stringify(req.query)].join('\n'));
            })
        .when('/')
            .then('/objects/1')
        .otherwise(function(req, res) {
            res.statusCode = 404;
            res.end('404');
        }),
    server = http.createServer(function(req, res) {
        var parsedUrl = url.parse(req.url, true);
        req.path = parsedUrl.pathname;
        req.query = parsedUrl.query;

        router.route(req, res);
    });

server.listen(3000, function(err) {
    console.log(err? err : 'Start listening on http://localhost:3000');
});