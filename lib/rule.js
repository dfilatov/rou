var matcherFactory = require('./matcher');

function Rule(router, url) {
    this._router = router;
    this._cb = null;
    this._paramsToMatch = [];

    var url = url.replace(/\{([^}]+)\}/g, function(_, param) {
            this._paramsToMatch.push(param);
            return '([^/]+)';
        }.bind(this));

    this._urlRe = RegExp('^' + this._normalizePath(url) + '$');
    this._matchers = [];
}

Rule.prototype = {
    method : function(method) {
        this._matchers.push(matcherFactory('method', { method : method }));
        return this;
    },

    param : function(name, cond) {
        this._matchers.push(matcherFactory('param', { name : name, cond : cond }));
        return this;
    },

    match : function(fn) {
        this._matchers.push(matcherFactory('custom', { fn : fn }));
        return this;
    },

    done : function(cb) {
        this._cb = cb;
        return this._router;
    },

    _match : function(request) {
        var matchedParams = this._urlRe.exec(this._normalizePath(request.path));
        if(!matchedParams) {
            return null;
        }

        var origQuery = request.query;

        request.query = this._mergeParams(matchedParams.slice(1), request.query);

        var matcher, i = 0;
        while(matcher = this._matchers[i++]) {
            if(!matcher.match(request)) {
                request.query = origQuery;
                return null;
            }
        }

        return request;
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
    },

    _normalizePath : function(url) {
        var res = url.trim();
        res.charAt(0) !== '/' && (res = '/' + res);
        res.charAt(res.length - 1) !== '/' && (res += '/');
        return res;
    },

    _apply : function(req) {
        if(!this._cb) {
            throw 'undefined callback';
        }

        this._cb(req);
    }
};

module.exports = Rule;