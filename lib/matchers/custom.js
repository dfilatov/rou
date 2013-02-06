function MethodMatcher(params) {
    this._fn = params.fn;
}

MethodMatcher.prototype = {
    match : function(req) {
        return (this.match = this._fn)(req);
    }
};

module.exports = MethodMatcher;