var mongodb = require('mongodb');
var fs = require('fs');
var argv = require('optimist')
    .usage('Usage: $0 -root [dir/loc] -find [regexp]')
    .demand(['root','find'])
    .argv;

// given a comd line input
// test.js rootlocation regexp
// finds all files where regexp is found, and stores info about that
// in a collection
// for each file where the regexp is found
// a document is added like this {location:string,occurrences:int}

var root = argv.root;
var find = argv.find;

if (!fs.existsSync(root)) throw root + " does not exist";

var finder = require('findit').find(root);

var server = new mongodb.Server('localhost',27017,{auto_reconnect:true});

var db = new mongodb.Db('mydb', server);

// if pat found in file, record number of entries and file path in database
var insert = function(coll, f, pat) {
    console.log('Found ' + pat + ' in ' + f);
    coll.insert({file: f, pattern: pat});
}

db.open(function(err,db) {
    if (err) throw(err);
    db.collection('widgets', function(err, coll) {
	if (err) throw (err);
        // null means remove all collections
	coll.remove(null, {safe:true}, function(err, res) {
		console.log("Removed " + coll + " result = " + res);
	});


        // insert some documents
        var finder = require('findit').find(root);
        //This listens for files found
        finder.on('file', function (file) {
               var dotstart = /^\..*/g;
               if (dotstart.test(file)) return;
               fs.readFile(file, 'utf8', function(err,data) {
                          if (data.search(find)>-1){
                               console.log('Found it in '+ file + '!');
                               insert(coll, file, find);
                          }
               } );               
        });
    });
});



