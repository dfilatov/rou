function MethodMatcher(params) {
    if(!params.method) {
        throw 'method expected';
    }

    this._method = params.method.toLowerCase();
}

MethodMatcher.prototype = {
    match : function(req) {
        return req.method? this._method === req.method.toLowerCase() : false;
    }
};

module.exports = MethodMatcher;