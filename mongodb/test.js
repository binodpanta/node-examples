var mongodb = require('mongodb');
var fs = require('fs');
var argv = require('optimist')
    .usage('Usage: $0 -root [dir/loc] -find [regexp] -filepat [pat]')
    .demand(['root','find','filepat'])
    .argv;

// given a comd line input
// test.js rootlocation regexp
// finds all files where regexp is found, and stores info about that
// in a collection
// for each file where the regexp is found
// a document is added like this {location:string,occurrences:int}

var root = argv.root; // root where to begin searching
var find = argv.find; // string to search in the files
var filepat = new RegExp(argv.filepat);// pattern for file names to include

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

    // Create a collection with the name which is the same as the
    // find string 'find'. So every new search string will create
    // a new collection and its search / find history stored 
    // in that collection
    db.collection(find, function(err, coll) {
	if (err) throw (err);
        // null means remove all collections
	//coll.remove(null, {safe:true}, function(err, res) {
	//	console.log("Removed " + coll + " result = " + res);
	//});


        // insert some documents
        var finder = require('findit').find(root);
        //This listens for files found
        finder.on('file', function (file) {
               var dotstart = filepat; // /.*\.r000$/g;
               if (!dotstart.test(file)) return;
               fs.readFile(file, 'utf8', function(err,data) {
                          if (data.search(find)>-1){
                               console.log('Found it in '+ file + '!');
                               insert(coll, file, find);
                          }
               } );               
        });
    });
});



