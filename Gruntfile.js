module.exports = function(grunt) {
    grunt.initConfig({
        jshint : {
            all : ['Gruntfile.js', 'lib/**/*.js'],
            options : {
                boss : true,
                expr : true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};