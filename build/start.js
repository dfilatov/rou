(function(global) {

var Rou = (function() {

var modules = {},
    require = function(name) {
        return modules[name];
    },
    define = function(name, deps, fn) {
        var module = { exports : {}};
        fn.apply(
            this,
            [require, module.exports, module].concat(
                deps.slice(3).map(function(depName) {
                    return modules[depName];
                })));
        modules['./' + name] = module.exports;
    };