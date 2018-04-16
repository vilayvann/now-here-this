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

var schema = new Schema({
    story_title:  String,
    audio_filename: String,
    producer: String,
    transcript_filename: String,
    story_image: String,
    date_produced: Date,
    keywords_in_transcript: [ String ],
    issue_id: Number,
    issue_name: String,
    meta: {
    	views: Number,
    	shares: Number
    }
});

