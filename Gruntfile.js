module.exports = function(grunt) {

  grunt.registerTask('default', ['jshint', 'qunit']);

  grunt.initConfig({
    qunit: {
      list: 'test/index.html'
    },
    jshint: {
      all: [
        'list.js',
        'test/*.js'
      ],
      options: {
        boss: true,
        undef: true,
        eqnull: true,
        globals: {
          // QUnit
          ok: true,
          test: true,
          module: true,
          raises: true,
          deepEqual: true,
          strictEqual: true,

          // Dependencies
          _: true,
          $: true,
          jQuery: true,
          Backbone: true,
          Quilt: true,
          List: true
        }
      }
    }
  });

};
