var Rule = require('./rule');

var Router = function() {
    this._routes = [];
    this._rewrites = [];
    this._fallback = null;
};

Router.prototype = {
    /**
     * Add route
     * @param {String} path
     * @returns {Rule}
     */
    when : function(path) {
        return new Rule(this, path);
    },

    /**
     * @param {Function} fn
     */
    otherwise : function(fn) {
        this._fallback = fn;
    },

    /**
     * Do routing
     * @param {Object} request
     * @param {String} request.path
     * @param {String} [request.method="get"]
     * @param {Object} [request.query]
     * @returns {boolean}
     */
    route : function(request) {
        if(!this._doRewrites(request)) {
            if(!this._doRouting(request) && this._fallback) {
                this._fallback(request);
            }
        }
    },

    _doRewrites : function(request) {
        var rewrite, matchedRequest, i = 0;
        while(rewrite = this._rewrites[i++]) {
            if(matchedRequest = rewrite.rule._match(request)) {
                this.route(this._rewriteRequest(matchedRequest, rewrite));
                return true;
            }
        }
        return false;
    },

    _doRouting : function(request) {
        var route, matchedRequest, i = 0;
        while(route = this._routes[i++]) {
            if(matchedRequest = route.rule._match(request)) {
                route.action(matchedRequest);
                return true;
            }
        }
        return false;
    },

    _rewriteRequest : function(request, rewrite) {
        request.path = rewrite.action;
        return request;
    },

    /**
     * @param {Rule} rule
     * @param {Function|String} action
     * @param {Object} [params]
     * @private
     */
    _add : function(rule, action, params) {
        var item = { rule : rule, action : action, params : params };
        typeof action === 'string'?
            this._rewrites.push(item) :
            this._routes.push(item);

        return this;
    }
};

module.exports = function() {
    return new Router();
};