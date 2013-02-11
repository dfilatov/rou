/**
 * Rou
 *
 * Copyright (c) 2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.3
 */

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