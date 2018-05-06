
// title,producers,helpers,year,month
// aqua-life,ari snider, Mitchell johnson, 
// aqua-life, Ari Snider, "Mitchell Johnson"]', '["winnie pooh"]',2010,08,10
// csv.producers --> "Ari Snider", "Mitchell Johnson"
// [" ", " "]


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
	story_id: String, //story folder name, for example, aqua_life_central
    story_name: String, // Needed to handle edge cases, with punctuation.    
    producers: [String], // Using ", " to seperate each name.
    helpers: [String], // the format is same as producers
    description: String,
    illustrator_credit: String,
    music_credit: String,
    date_produced: Date,
    keywords_in_transcript: [ String ], // implement later
    issue_id: Number, // stories without an issue have id 0, else it's 1, 2, ...
    issue_name: String, 
    transcript: Number,
    meta: {
        views: Number, // optional
        shares: Number // optional
    }
});

var Story = mongoose.model('Story', story_schema);

var staff_schema = new mongoose.Schema({
    name: String, // e.g. "Mitchell Johnson"
    role: String,
    year: Number,
    bio: String
});

var Staff = mongoose.model('Staff', staff_schema);

var keywords_schema = new mongoose.Schema({
    story_id: String,
    story_name: String,
    keywords: [ String ]
})
var Keywords = mongoose.model('Keywords', keywords_schema);

// TODO: Might not need to store mp3, pdf file names in database, since we can go into dir and get them.
function populateDatabase(story_title, audio_filename, producer_first, producer_last, transcript, story_image, date_produced, keywords_in_transcript, issue_id, issue_name, views, shares) {
    console.log(story_title)
    var entry = {
        story_title: story_title
    }
}

// populate data extracted from stories.csv, to store in database.
function populateInitial(story_id, story_name, producers, helpers, description, illustrator_credit, music_credit, date_produced, issue_id, transcript) {

    var story = new Story({
        story_id: story_id, 
        story_name: story_name,
        producers: producers,
        helpers: helpers,
        description: description,
        illustrator_credit: illustrator_credit,
        music_credit: music_credit,
        date_produced: date_produced,
        issue_id: issue_id,
        transcript: transcript
    });
    story.save(function(err, data) {
        if (err) return console.error(err);
        // console.log(data);
    });
}

function populateStaffSchema(name, role, year, bio) {
    var staff = new Staff({
        name: name,
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

function populateKeywords(story_id, story_name, keywords) {
    var keywords = new Keywords({
        story_id: story_id,
        story_name: story_name,
        keywords: keywords
    });
    keywords.save(function(err, data) {
        if (err) return console.error(err);
        console.log("sucess")
    })
}

// keywords is an array of words.
function pushKeywordsToDatabase(story_id, keywords) {
    // mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');
    // var query = { story_id: story_id };
    // var new_values = { $set: {keywords_in_transcript: keywords} };

    // Story.find({"story_id": story_id}, function(err, story) {
    //     story.keywords_in_transcript = keywords
    //     story.save(function(err, data) {
    //         if (err) return console.error(err);
    //     });
    // });

    // Story.create({ story_id: story_id }, function(err, data) {
    //     data.keywords_in_transcript = keywords;
    //     data.save(function(err) {
    //         if (err) return console.error(err)
    //     });
    // });

    Story.update({story_id: story_id}, {
        keywords_in_transcript: keywords
    }, function(err, res) {
        if (err) throw err;
       console.log("updated")
    })

    // console.log("updated")
    console.log(story_id)

    // story.save(function(err, data) {
    //     if (err) return console.error(err);
    // });

    // Story.findOneAndUpdate(query, new_values, function(err, res) {
    //     if (err) throw err;
    //     console.log("pushed keywords successfully")
    // });
    // mongoose.connection.close();
}


exports.populateInitial = populateInitial
exports.populateStaffSchema = populateStaffSchema
exports.pushKeywordsToDatabase = pushKeywordsToDatabase
exports.populateKeywords = populateKeywords
