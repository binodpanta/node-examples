# Using Grunt watch to build a simple auto-run workflow for running custom code while developing a Node Project

## Step 1 Install tools

    npm init
    npm install -g grunt-cli # to use 'grunt' tool
    npm install grunt   # to use grunt local version in project
    npm install grunt-contrib-watch # to implement watch feature
    npm install prettyjson # just to print some json prettily
    npm install eslint # if using an IDE like VSCode, nice to have this to get auto ESLinting

## Step 2 Setup Gruntfile

Assuming you want to run 'node test.js' when your files are saved, your Gruntfile should contain a watch configuration similar to shown below

Here I use **grunt-execute** plugin to run the node script, there are other methods too
For example you can run mocha test, nodeunit test etc or something else, that you want

While developing a single script, it may be enough to run it directly (like test.js in this example) but ideally you should run a test instead and print coverage or whatever else you want (using nyc + mocha is a nice great combo I use and love, for example)


```json
module.exports = function(grunt) {

// gruntfile showing how to autorun test.js while saving .js files. Just run grunt watch in the folder in a terminal and leave it running and forget about it (almost)
  
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



That's essentially it, now every time you save .js files in the main folder here, (*.js) it will rerun the execute:test Grunt task which in turn is setup to run test.js (or whatever you want)

It does not matter what IDE you use or even just vi, when you save, it runs waht you want now

What I like about this setup is that it does not force you to use Grunt even, if you don't want to. I don't now why you would not use a task runner these days but still if you want, you can set this up once and almost forget about it.

I find the simple setup sufficient for many projects, without getting too fancy. But of course if you want more features like restarting server when stuff changes, you may want to check out NodeMon, Chokidar etc.

Find example Gruntfile and package.json code in this repo. Happy Node-ing!