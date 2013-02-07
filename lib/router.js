var Rule = require('./rule'),
    utils = require('./utils');

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
     * Add fallback if no route found
     * @param {Function} fn
     */
    otherwise : function(fn) {
        this._fallback = fn;
    },

    /**
     * Do routing
     * @param {Object} req
     * @param {String} req.path
     * @param {String} [req.method="get"]
     * @param {Object} [req.query]
     * @returns {boolean}
     */
    route : function(req) {
        if(!this._doRewrites(req)) {
            if(!this._doRouting(req) && this._fallback) {
                this._fallback(req);
            }
        }
    },

    _doRewrites : function(req) {
        var rewrite, matchedRequest, i = 0;
        while(rewrite = this._rewrites[i++]) {
            if(matchedRequest = rewrite.rule._match(req)) {
                this.route(this._applyRewrite(rewrite, matchedRequest));
                return true;
            }
        }
        return false;
    },

    _doRouting : function(req) {
        var route, matchedRequest, i = 0;
        while(route = this._routes[i++]) {
            if(matchedRequest = route.rule._match(req)) {
                this._applyRoute(route, matchedRequest);
                return true;
            }
        }
        return false;
    },

    _applyRewrite : function(rewrite, req) {
        req.path = rewrite.action.replace(/\{([^}]+)\}/g, function(_, name) {
            var param = req.query[name];
            if(param) {
                delete req.query[name];
                return param;
            }
        });

        rewrite.params && (req.query = utils.merge(req.query, rewrite.params));

        return req;
    },

    _applyRoute : function(route, req) {
        route.action(req);
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