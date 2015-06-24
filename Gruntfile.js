module.exports = function(grunt) {

  // plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.initConfig({
    clean: {
      all: {
        src: ['coverage/']
      }
    },

    mocha_istanbul: {
      coverage: {
        src: 'tests', // the folder, not the files,
        options: {
          root: './lib',
          mask: '**/*.spec.js',
          excludes: ['*.spec.js'],
          reportFormats: ['text','html']
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
    }
  });

  grunt.registerTask('travis', ['clean', 'mocha_istanbul:travis']);
  grunt.registerTask('default', ['mocha_istanbul:coverage']);

};
