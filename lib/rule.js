var matcherFactory = require('./matcher');

function Rule(router, path) {
    this._router = router;
    this._matchers = [];
    this._paramsToMatch = [];

    path = path.replace(/\{([^}]+)\}/g, function(_, param) {
        this._paramsToMatch.push(param);
        return '([^/]+)';
    }.bind(this));

    this._pathRE = RegExp('^' + normalizePath(path) + '$');
}

Rule.prototype = {
    /**
     * Add method matcher
     * @param {String} method
     * @returns {this}
     */
    method : function(method) {
        this._matchers.push(matcherFactory('method', { method : method }));
        return this;
    },

    /**
     * Add param matcher
     * @param {String} name
     * @param {String|Boolean|RegExp|String[]|Function} [cond]
     * @returns {this}
     */
    param : function(name, cond) {
        this._matchers.push(matcherFactory('param', { name : name, cond : cond }));
        return this;
    },

    /**
     * Add custom matcher
     * @param {Function} fn
     * @return {this}
     */
    match : function(fn) {
        this._matchers.push(matcherFactory('custom', { fn : fn }));
        return this;
    },

    /**
     * Add routing or rewrite action
     * @param {Function|String} action
     * @param {Object} [params]
     * @return {Router}
     */
    then : function(action, params) {
        return this._router._add(this, action, params);
    },

    _match : function(req) {
        var matchedParams = this._pathRE.exec(normalizePath(req.path));
        if(!matchedParams) {
            return null;
        }

        req.query = this._mergeParams(matchedParams.slice(1), req.query);

        var matcher, i = 0;
        while(matcher = this._matchers[i++]) {
            if(!matcher.match(req)) {
                return null;
            }
        }

        return req;
    },

    _mergeParams : function(matchedParams, queryParams) {
        var res = {},
            urlParam, i = 0;

        while(urlParam = this._paramsToMatch[i]) {
            res[urlParam] = matchedParams[i++];
        }

        if(queryParams) {
            for(var j in queryParams) {
                queryParams.hasOwnProperty(j) && (res[j] = queryParams[j]);
            }
        }

        return res;
    }
};

function normalizePath(path) {
    var res = path.trim();
    res.charAt(0) !== '/' && (res = '/' + res);
    res.charAt(res.length - 1) !== '/' && (res += '/');
    return res;
}

module.exports = Rule;