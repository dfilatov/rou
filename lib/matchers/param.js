function ParamMatcher(params) {
    if(!params.name) {
        throw 'param matcher: name expected';
    }

    this._name = params.name;
    this._cond = params.cond;
}

ParamMatcher.prototype = {
    match : function(req) {
        var condType = typeof this._cond;
        if(condType === 'undefined') {
            this.match = function(req) {
                return !!req.query[this._name];
            };
        }
        else if(condType === 'boolean') {
            this.match = function(req) {
                return this._cond?
                    typeof req.query[this._name] !== 'undefined' :
                    typeof req.query[this._name] === 'undefined';
            };
        }
        else if(condType === 'string') {
            this.match = function(req) {
                return this._cond === req.query[this._name];
            };
        }
//        else if(this._cond === Number) {
//            this._cond = RegExp('^\\d+$');
//            this.match = function(req) {
//                return this._cond.test(req.query[this._name]);
//            };
//        }
        else if(Array.isArray(this._cond)) {
            this.match = function(req) {
                return this._cond.indexOf(req.query[this._name]) > -1;
            };
        }
        else if(this._cond instanceof RegExp) {
            this.match = function(req) {
                return this._cond.test(req.query[this._name]);
            };
        }
        else if(condType === 'function') {
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