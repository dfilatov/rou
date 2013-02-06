var Rule = require('./rule');

var Router = function() {
    this._routes = [];
    this._rewrites = [];
};

Router.prototype = {
    add : function() {
        var args = arguments;
        return typeof args[1] === 'string'?
            this._addRewrite(args[0], args[1]) :
            this._addRoute(args[0]);
    },

    route : function(request) {
        var route, matchedParams, i = 0;
        while(route = this._routes[i++]) {
            if(matchedParams = route._match(request)) {
                route._apply(matchedParams);
                return true;
            }
        }
        return false;
    },

    _addRoute : function(url) {
        var rule = new Rule(this, url);
        this._routes.push(rule);
        return rule;
    },

    _addRewrite : function(rewrite) {

    }
};

module.exports = function() {
    return new Router();
};