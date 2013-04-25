
// To get json data and parse it
var request = require('request');

var songs = {
    hth : {title: 'Highway To Hell', lyrics: 'Living easy, living free \nSeason ticket on a one-way ride'},
    doj : {title: 'Drops of Jupiter', lyrics: 'Now that she\'s back in the atmosphere' },
    tstk: {title: 'Thunderstruck', lyrics: 'I was caught\nin the middle of a railroad track' }
};

// This Index page is mapped to this
exports.list = function(req, res){
    res.render('songs-all', {songs: songs});
};


exports.lyrics = function(req, res){
  
  if (req.params.title){
      
    //res.render('songs', {title: req.params.title, lyrics: getLyrics(req.params.title)});
    
    var url = 'http://lyrics.wikia.com/api.php?artist=ACDC&song='+req.params.title+'&fmt=json';
    
    //var url = 'http://api.discogs.com/database/search?track='+req.param.title;
    // option1 : Pipe the response json directly to the response stream!
    // request(url).pipe(res);
    
    // if not, get from remote store, in this case wikia
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200 && response.body) {
       res.render('songs', {title: req.params.title, lyrics: (response.body.replace("song = ","")) });
      } else {
          res.render('songs', {title: req.params.title, lyrics: getLyrics(req.params.title)});
      }
     });
    
  }
      
  else res.send('Sorry, no song was specified');
};

function getLyrics(title) {

    // get from local store
	for (var i in songs) {
     if (songs[i].title === title) return songs[i].lyrics;   
	}
    return "Not found!";
}


// Demo form handling, search method
exports.search = function(req, res) {
    if (req.body.title){    
    var url = 'http://lyrics.wikia.com/api.php?artist='+req.body.artist+'&song='+req.body.title+'&fmt=json';
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200 && response.body) {
       res.render('songs', {title: req.body.title, lyrics: (response.body.replace("song = ","")) });
      } else {
          res.render('songs', {title: req.body.title, lyrics: getLyrics(req.body.title)});
      }
     });
    
  }
      
  else res.send('index');
}
