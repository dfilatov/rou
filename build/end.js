return require('./router');

})();

if(typeof exports === 'object') {
    module.exports = Rou;
}
else if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = Rou;
    });
}
else {
    global.Rou = Rou;
}

})(this);