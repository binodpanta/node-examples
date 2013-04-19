

var songs = {
    hth : {title: 'Highway To Hell', lyrics: 'Living easy, living free \nSeason ticket on a one-way ride'},
    doj : {title: 'Drops of Jupiter', lyrics: 'Now that she\'s back in the atmosphere' },
    tstk: {title: 'Thunderstruck', lyrics: 'I was caught in the middle of a railroad track' }
};

// This Index page is mapped to this
exports.list = function(req, res){
    res.render('songs-all', {songs: songs});
};


exports.lyrics = function(req, res){
  //
  if (req.params.title)
      res.render('songs', {title: req.params.title, lyrics: getLyrics(req.params.title)});
  else res.send('Sorry, no song was specified');
};

function getLyrics(title) {

	for (i in songs) {
     if (songs[i].title === title) return songs[i].lyrics;   
	}
	return "Not found!";
}
