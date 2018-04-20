var utils = require('./utils.js')
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

var story_schema = new mongoose.Schema({
    story_title: String, // story folder name
    // audio_filename: String,
    producer_first_name: String,
    producer_last_name: String,
    // transcript: String,
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

var Story = mongoose.model('Story', story_schema);

var staff_schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    role: String,
    year: Number,
    bio: String
});

var Staff = mongoose.model('Staff', staff_schema);

// TODO: Might not need to store mp3, pdf file names in database, since we can go into dir and get them.
function populateDatabase(story_title, audio_filename, producer_first, producer_last, transcript, story_image, date_produced, keywords_in_transcript, issue_id, issue_name, views, shares) {

    var entry = {
        story_title: story_title
    }

    // collection.update({_id:story_title}, {
    //     story_title: story_title, 
    //     audio_filename: 
    //     producer_first_name: producer_first, 
    //     producer_last_name: producer_last,
    //     date_produced: date_produced,
    //     issue_id: issue_id,
    //     issue_name:issue_name,
    //     meta: {views: views, shares: shares}
    //     }update[[, options], callback]);
    }

// populate data extracted from stories.csv, to store in database.
function populateInitial(story_title, producer_first, producer_last, date_produced, issue_id) {
    //  var collection = db.collection()
    //  collection.update({_id:story_title}, {
    //        story_title: story_title, 
    //        producer_first_name: producer_first, 
    //        producer_last_name: producer_last,
    //        date_produced: date_produced,
    //        issue_id: issue_id
    //    }, {upsert: true});
    var story = new Story({
        story_title: story_title, 
        producer_first_name: producer_first,
        producer_last_name: producer_last,
        issue_id: issue_id
    });
    story.save(function(err, data) {
        if (err) return console.error(err);
        console.log(data);
    });
    // mongoose.connection.close();
}

function populateStaffSchema(first, last, role, year, bio) {
    var staff = new Staff({
        first_name: first,
        last_name: last,
        role: role,
        year: year,
        bio: bio
    });
    staff.save(function(err, data) {
        if (err) return console.error(err);
        console.log(data)
    });
    // mongoose.connection.close();
}

exports.populateInitial = populateInitial
exports.populateStaffSchema = populateStaffSchema
