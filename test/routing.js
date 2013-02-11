var Rou = require('../lib/router'),
    utils = require('../lib/utils');

describe('routing', function() {
    it('should route by simple path', function() {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            router = Rou()
                .when('/objects/object/')
                    .then(spy1)
                .when('/objects/')
                    .then(spy2)
                .when('/objects/')
                    .then(spy3);

        router.route({ path : '/objects' });

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
        spy3.should.not.have.been.called;
    });

    it('should route by path with matchers and match params', function() {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            router = Rou()
                .when('/objects/')
                    .then(spy1)
                .when('/objects/{id}')
                    .then(spy2)
                .when('/objects/{oid}')
                    .then(spy3);

        router.route({ path : '/objects/23', query : { a : 'b' }});

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
        spy2.should.have.been.calledWith({ path : '/objects/23', query : { a : 'b', id : '23' }});
        spy3.should.not.have.been.called;
    });

    it('should route by path only if all matchers matched', function() {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            router = Rou()
                .when('objects')
                    .param('id', true)
                    .param('type', 'railway')
                    .then(spy1)
                .when('objects')
                    .param('id', true)
                    .param('type', 'road')
                    .then(spy2);

        router.route({ path : '/objects/', query : { id : '12', type : 'road' }});

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
    });

    it('should continue route by path if action returns false', function() {
        var spy1 = sinon.spy(),
            req2,
            spy2 = sinon.spy(function(req) {
                req2 = utils.merge(req);
                return false;
            }),
            spy3 = sinon.spy(),
            router = Rou()
                .when('/objects/')
                    .then(spy1)
                .when('/objects/{id}')
                    .then(spy2)
                .when('/objects/{oid}')
                    .then(spy3);

        router.route({ path : '/objects/23', query : { a : 'b' } });

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
        req2.should.be.deep.equal({ path : '/objects/23', query : { a : 'b', id : '23' }});
        spy3.should.have.been.calledOnce;
        spy3.should.have.been.calledWith({ path : '/objects/23', query : { a : 'b', oid : '23' }});
    });

    it('should route to otherwise if no matching rule', function() {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            router = Rou()
                .when('/objects')
                    .then(spy1)
                .otherwise(spy2);

        router.route({ path : '/' });

        spy1.should.not.have.been.called;
        spy2.should.have.been.calledOnce;
    });

    it('shouldn\'t route to otherwise if action returns false', function() {
        var spy1 = sinon.spy(function() {
                return false;
            }),
            spy2 = sinon.spy(),
            router = Rou()
                .when('/objects')
                    .then(spy1)
                .otherwise(spy2);

        router.route({ path : '/objects' });

        spy1.should.have.been.called;
        spy2.should.not.have.been.calledOnce;
    });
});