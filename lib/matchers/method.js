function MethodMatcher(params) {
    if(!params.method) {
        throw 'method expected';
    }

    this._methods = Array.isArray(params.method)?
        params.method.map(function(method) {
            return method.toLowerCase();
        }) :
        [params.method.toLowerCase()];
}

MethodMatcher.prototype = {
    match : function(req) {
        return this._methods.indexOf(
            req.method?
                req.method.toLowerCase() :
                'get') > -1;
    }
};

module.exports = MethodMatcher;