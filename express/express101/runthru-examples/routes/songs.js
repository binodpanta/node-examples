

exports.lyrics = function(req, res){
  //
  if (req.params.title)
      res.render('songs', {title: req.params.title, lyrics: getLyrics(req.params.title)});
  else res.send('Sorry, no song was specified');
};

function getLyrics(title) {

	if (title.search('hell')==0) return "Living easy, living free";
	return "Not found!";
}