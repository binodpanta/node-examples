module.exports = function(grunt) {


grunt.initConfig( {
    execute: {
        test: {
            src: ['test.js']
        }
    },
    watch: {
        js: {
            files: ['*.js'],
            tasks: ['execute:test']
          }
    }
}
)
grunt.registerTask('default', ['watch']);

// Load up tasks
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-execute');
};
