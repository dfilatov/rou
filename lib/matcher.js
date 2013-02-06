var matcherCls = {
        method : require('./matchers/method'),
        param  : require('./matchers/param'),
        custom : require('./matchers/custom')
    };

module.exports = function(type, params) {
    return new matcherCls[type](params);
};