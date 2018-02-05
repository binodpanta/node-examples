# Using Grunt watch to build a nice workflow for re running code while developing a Node Project

## Step 1 Install tools

    npm init
    npm install -g grunt-cli # to use 'grunt' tool
    npm install grunt   # to use grunt local version in project
    npm install grunt-contrib-watch # to implement watch feature
    npm install prettyjson # just to print some json prettily
    npm install eslint # if using an IDE like VSCode, nice to have this to get auto ESLinting

## Step 2 Setup Gruntfile

Assuming you want to run 'node test.js' when your files are saved, your Gruntfile should contain a watch configuration similar to this

Here I use grunt-execute plugin to run the node script, there are other methods too
For example you can run mocha test, nodeunit test etc or something else, that you want

While developing a single script, it may be enough to run it directly but ideally you should run a test instead


```json
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

```



