var Rou = require('../lib/router');

describe('rewrites', function() {
    it('should route by rewrites', function() {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            router = Rou()
                .when('/objects/')
                    .then(spy1)
                .when('/objects/{id}')
                    .then(spy2)
                .when('/objects/{oid}')
                    .then(spy3)
                .when('/objects/new')
                    .then('/objects/23')
                .when('/objects')
                    .then('/objects/new');

        router.route({ path : '/objects', query : { a : 'b' } });

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
        spy2.should.have.been.calledWith({ path : '/objects/23', query : { a : 'b', id : '23' }});
        spy3.should.not.have.been.called;
    });

    it('should add params', function() {
        var spy1 = sinon.spy(),
            router = Rou()
                .when('/{id}')
                    .then(spy1)
                .when('/objects/{new}')
                    .param('new', 'new')
                    .then('/23', { b : 'c' })
                .when('/objects')
                    .param('new', 'new')
                    .then('/objects/{new}', { c : 'd' });

        router.route({ path : '/objects', query : { new : 'new', a : 'b' } });
        spy1.should.have.been.calledWith({ path : '/23', query : { new : 'new', a : 'b', b : 'c', c : 'd', id : '23' }});
    });

    it('should use each rewrite once', function() {
        var spy = sinon.spy(),
            router = Rou()
                .when('/objects/{id}')
                    .then('/objects/34')
                .otherwise(spy);

        router.route({ path : '/objects/12' });
        spy.should.have.been.calledWith({ path : '/objects/34', query : { id : '12' }});
    });

    it('should rewrite in otherwise', function() {
        var spy = sinon.spy(),
            router = Rou()
                .when('/objects/')
                    .then(spy)
                .otherwise('/objects/');

        router.route({ path : '/' });
        spy.should.have.been.calledWith({ path : '/objects/', query : {}});
    });

    it('should rewrite in otherwise once', function() {
        var spy = sinon.spy(),
            router = Rou()
                .when('/objects')
                    .then(spy)
                .otherwise('/');

        router.route({ path : '/' });
        spy.should.not.have.been.called;
    });
});