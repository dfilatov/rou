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

describe('method matcher', function() {
    it('should throw exception if no method in params', function() {
        var fn = function() {
                matcherFactory('method', {});
            };
        fn.should.throw('method expected');
    });

    it('should match method from string', function() {
        var matcher = matcherFactory('method', { method : 'get' });
        matcher.match({ method : 'get' }).should.be.true;
        matcher.match({ method : 'post' }).should.be.false;
    });

    it('should match methods from array', function() {
        var matcher = matcherFactory('method', { method : ['get', 'post'] });
        matcher.match({ method : 'get' }).should.be.true;
        matcher.match({ method : 'post' }).should.be.true;
    });

    it('should match default method', function() {
        var matcher = matcherFactory('method', { method : 'get' });
        matcher.match({}).should.be.true;
    });
});