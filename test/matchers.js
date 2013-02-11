var matcherFactory = require('../lib/matcher'),
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
                new MethodMatcher({});
            };
        fn.should.throw('method matcher: method expected');
    });

    it('should match method by string', function() {
        var matcher = new MethodMatcher({ method : 'get' });
        matcher.match({ method : 'get' }).should.be.true;
        matcher.match({ method : 'post' }).should.be.false;
    });

    it('should match methods by array', function() {
        var matcher = new MethodMatcher({ method : ['get', 'post'] });
        matcher.match({ method : 'get' }).should.be.true;
        matcher.match({ method : 'post' }).should.be.true;
    });

    it('should match default method', function() {
        var matcher = new MethodMatcher({ method : 'get' });
        matcher.match({}).should.be.true;
    });
});

describe('param matcher', function() {
    it('should throw exception if no name in params', function() {
        var fn = function() {
                new ParamMatcher({});
            };
        fn.should.throw('param matcher: name expected');
    });

    it('should match param if exists', function() {
        var matcher = new ParamMatcher({ name : 'a' });
        matcher.match({ query : { a : 'b' }}).should.be.true;
        matcher.match({ query : { a : '' }}).should.be.true;
        matcher.match({ query : {}}).should.be.false;
    });

    it('should match only non-empty param', function() {
        var matcher = new ParamMatcher({ name : 'a', cond : true });
        matcher.match({ query : { a : 'b' }}).should.be.true;
        matcher.match({ query : { a : '' }}).should.be.false;
        matcher.match({ query : {}}).should.be.false;
    });

    it('should match only if param no exists', function() {
        var matcher = new ParamMatcher({ name : 'a', cond : false });
        matcher.match({ query : { a : 'b' }}).should.be.false;
        matcher.match({ query : { a : '' }}).should.be.false;
        matcher.match({ query : {}}).should.be.true;
    });

    it('should match param by string', function() {
        var matcher = new ParamMatcher({ name : 'a', cond : 'b' });
        matcher.match({ query : { a : 'b' }}).should.be.true;
        matcher.match({ query : {}}).should.be.false;
        matcher.match({ query : { a : 'bb' }}).should.be.false;
        matcher.match({ query : { a : '' }}).should.be.false;
    });

    it('should match param by array', function() {
        var matcher = new ParamMatcher({ name : 'a', cond : ['b', 'c'] });
        matcher.match({ query : { a : 'b' }}).should.be.true;
        matcher.match({ query : { a : 'c' }}).should.be.true;
        matcher.match({ query : { a : 'd' }}).should.be.false;
        matcher.match({ query : {}}).should.be.false;
        matcher.match({ query : { a : '' }}).should.be.false;
    });

    it('should match param by regexp', function() {
        var matcher = new ParamMatcher({ name : 'a', cond : /^\d+$/ });
        matcher.match({ query : { a : '34' }}).should.be.true;
        matcher.match({ query : {}}).should.be.false;
        matcher.match({ query : { a : 'a34' }}).should.be.false;
        matcher.match({ query : { a : '' }}).should.be.false;
    });

    it('should match param by function', function() {
        var matcher = new ParamMatcher(
                {
                    name : 'a',
                    cond : function(val) {
                        val = parseInt(val, 10);
                        return !isNaN(val) && val > 5;
                    }
                });
        matcher.match({ query : { a : '34' }}).should.be.true;
        matcher.match({ query : {}}).should.be.false;
        matcher.match({ query : { a : '4' }}).should.be.false;
        matcher.match({ query : { a : '' }}).should.be.false;
    });
});

describe('custom matcher', function() {
    it('should match by function', function() {
        var matcher = new CustomMatcher(
                {
                    fn : function(req) {
                        return req.method === 'get' || req.query.a === 'b';
                    }
                });

        matcher.match({ method : 'get', query : { a : 'c' }}).should.be.true;
        matcher.match({ method : 'post', query : { a : 'b' }}).should.be.true;
        matcher.match({ method : 'get', query : { a : 'b' }}).should.be.true;
        matcher.match({ method : 'post', query : { a : 'c' }}).should.be.false;
    });
});