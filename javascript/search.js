var stemmer = require('stemmer');
    mongoose = require('mongoose');
    sleep = require('sleep');

mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');

var keywords_schema = new mongoose.Schema({
    story_id: String,
    keywords: [ String ]
})
var Keywords = mongoose.model('Keywords', keywords_schema);

var result = []

// Input: the original search string.
function search(search_string) {
	search_string = search_string.toLowerCase()

	var words = search_string.split(' ')
	// stem those words.
	var stemmed = words.map(function(word) {
		var new_word = stemmer(word)
		return new_word
	});

	Keywords.find().or([{ story_id: { $regex: stemmed, $options: "$i" }}, { keywords: { $in: stemmed }}]).exec(
    function (err, topics) {
      if (err) {
        console.log(err)
      }
      console.log(topics.length)
      for (i = 0; i < topics.length; i++) {
      	result.push(topics[i].story_id)
      }
      
      // RENDER RESULT HERE.
    });	
}
