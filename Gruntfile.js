module.exports = function(grunt) {

    // plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        clean: {
            all: {
                src: ['coverage/', 'reports/']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: 'tests', // the folder, not the files,
                options: {
                    root: './lib',
                    mask: '**/*.spec.js',
                    excludes: ['*.spec.js'],
                    reportFormats: ['text', 'html']
                }
            },
            travis: {
                src: 'tests', // the folder, not the files,
                options: {
                    quiet: true,
                    root: './lib',
                    mask: '**/*.spec.js',
                    excludes: ['*.spec.js'],
                    reportFormats: ['lcov']
                }
            }
        },

        mochaTest: {
            circle: {
                options: {
                    reporter: 'mocha-junit-reporter',
                    reporterOptions: {
                        mochaFile: 'reports/junit/test-results.xml'
                    },
                    quiet: true
                },
                src: ['tests/**/*.spec.js']
            }
        }
    });

    grunt.registerTask('travis', ['clean', 'mocha_istanbul:travis']);
    grunt.registerTask('circle', ['clean', 'mochaTest:circle']);
    grunt.registerTask('default', ['mocha_istanbul:coverage']);

};
