(function () {
    'use strict';
    module.exports = function(grunt) {

        require('load-grunt-config')(grunt, {
            data: {
                pkg: grunt.file.readJSON('package.json')
            },
            loadGruntTasks: {
                pattern: 'grunt-*',
                config: require('./package.json'),
                scope: 'devDependencies'
            }
        });
    };
})();
