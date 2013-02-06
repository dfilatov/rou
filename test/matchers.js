var should = require('chai').should(),
    matcherFactory = require('../lib/matcher'),
    MethodMatcher = require('../lib/matchers/method'),
    ParamMatcher = require('../lib/matchers/param'),
    CustomMatcher = require('../lib/matchers/custom');

describe('matcher factory', function() {
    it('should instantiate MethodMatcher', function() {
        matcherFactory('method', { method : 'get' }).should.be.an.instanceof(MethodMatcher);
    });

    it('should instantiate ParamMatcher', function() {
        matcherFactory('param', { name : 'a' }).should.be.an.instanceof(ParamMatcher);
    });

    it('should instantiate CustomMatcher', function() {
        matcherFactory('custom', { fn : function() {} }).should.be.an.instanceof(CustomMatcher);
    });
});