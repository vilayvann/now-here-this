import {getDirectoriesRecursive} from 'utils'

var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error); // log any errors that occur

// bind a function to perform when the database has been opened
db.once('open', function() {
	// perform any queries here, more on this later
	console.log("Connected to DB!");
});

// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
    	console.log('DB connection closed by Node process ending');
    	process.exit(0);
  	});
});

// the user, password, and url values will be explained next
mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');

var story_schema = new Schema({
    story_title: String, // story folder name
    audio_filename: String,
    producer: String,
    transcript_filename: String,
    story_image: String,
    date_produced: Date,
    keywords_in_transcript: [ String ],
    issue_id: Number, // stories without an issue have id 0, else it's 1, 2, ...
    issue_name: String, 
    meta: {
    	views: Number, // optional
    	shares: Number // optional
    }
});

var staff_schema = new Schema({
    first_name: String,
    last_name: String,
    role: String,
    year: Date,
    bio: String
});

// for loop that calls populateDatabase on all folders within /stories.
// TODO (vky): loop through directories



// INITIAL ADD TO THE DATABASE IF NOT EXISTS
// (vky) Hope this works.
// story_title is unique, so can probably query by that too.
function populateDatabase(story_title, audio_filename, producer, transcript_filename, story_image, date_produced, keywords_in_transcript, issue_id, issue_name, views=undefined, shares=undefined) {

    // TODO (vky): implement.
    var entry = {
        story_title: story_title
    }
    // collection.update(criteria, update[[, options], callback]);

}



