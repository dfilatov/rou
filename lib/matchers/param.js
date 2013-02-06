function ParamMatcher(params) {
    this._name = params.name;
    this._cond = params.cond;
}

ParamMatcher.prototype = {
    match : function(req) {
        if(typeof this._cond === 'undefined') {
            this.match = function(req) {
                return typeof req.query[this._name] !== 'undefined';
            };
        }
        else if(this._cond === Number) {
            this._cond = RegExp('^\\d+$');
            this.match = function(req) {
                return this._cond.test(req.query[this._name]);
            };
        }
        else if(this._cond instanceof RegExp) {
            this.match = function(req) {
                return this._cond.test(req.query[this._name]);
            };
        }
        else if(typeof this._cond === 'function') {
            this.match = function(req) {
                return !!this._cond(req.query[this._name]);
            };
        }
        else {
            this.match = function(req) {
                return this._cond == req.query[this._name];
            };
        }

        return this.match(req);
    }
};

module.exports = ParamMatcher;