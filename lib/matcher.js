module.exports = function(type, params) {
    return new (require('./matchers/' + type))(params);
};