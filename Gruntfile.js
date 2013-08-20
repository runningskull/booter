module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
       noParse: ['vendor/*']
    }
  })

  grunt.loadNpmTasks('grunt-browserify')
}
