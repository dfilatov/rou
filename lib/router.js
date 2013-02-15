var Rule = require('./rule'),
    utils = require('./utils');

var Router = function() {
    this._routes = [];
    this._rewrites = [];
    this._fallback = null;
    this._curRouteArgs = null;
    this._matchedRewrites = [];
};

Router.prototype = {
    /**
     * Add route rule
     * @param {String} path
     * @returns {Rule}
     */
    when : function(path) {
        return new Rule(this, path);
    },

    /**
     * Add fallback
     * @param {Function|String} action
     * @param {Object} [params]
     * @return {this}
     */
    otherwise : function(action, params) {
        this._fallback = { action : action, params : params };
        return this;
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
        var isRecursive = !!this._curRouteArgs;
        if(!isRecursive) {
            this._curRouteArgs = arguments;
        }

        if(!this._doRewrites(req) && !this._doRouting(req)) {
            this._doFallback(req);
        }

        if(!isRecursive) {
            this._curRouteArgs = null;
            this._matchedRewrites = [];
        }
    },

    _doRewrites : function(req) {
        var rewrite, matchedReq, i = 0;
        while(rewrite = this._rewrites[i++]) {
            if(this._matchedRewrites.indexOf(rewrite) < 0 && (matchedReq = rewrite.rule._match(req))) {
                this._matchedRewrites.push(rewrite);
                this.route(this._applyRewrite(rewrite, matchedReq));
                return true;
            }
        }
        return false;
    },

    _doRouting : function(req) {
        var origQuery = req.query,
            wasMatched = false,
            route, matchedReq, i = 0;

        while(route = this._routes[i++]) {
            if(matchedReq = route.rule._match(req)) {
                wasMatched = true;
                if(this._applyRoute(route, matchedReq) !== false) {
                    return true;
                }

                req.query = origQuery;
            }
        }

        return wasMatched;
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

    _applyRoute : function(route) {
        return route.action.apply(null, this._curRouteArgs);
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
    },

    _doFallback : function(req) {
        var fallback = this._fallback;
        if(!fallback) {
            return;
        }

        if(typeof fallback.action === 'string') {
            if(this._matchedRewrites.indexOf(fallback) < 0) {
                this._matchedRewrites.push(fallback);
                this.route(this._applyRewrite(fallback, req));
            }
        }
        else {
            fallback.action.apply(null, this._curRouteArgs);
        }
    }
};

module.exports = function() {
    return new Router();
};