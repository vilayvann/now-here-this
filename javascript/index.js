var utils = require('./utils.js');
var express = require('express'),
    bp = require('body-parser'),
    hogan = require('hogan.js'),
    engines = require('consolidate'),
    mongoose = require('mongoose');
// for loop that calls populateDatabase on all folders within /stories.
// TODO (vky): loop through directories

var app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());
app.use(express.static('templates'));
app.use(express.static('staff'));
app.use(express.static('stories'));

app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html'); 

mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');

var story_schema = new mongoose.Schema({
    story_title: String, // story folder name
    audio_filename: String,
    producer_first_name: String,
    producer_last_name: String,
    transcript: String,
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
    year: Date,
    bio: String
});

var Staff = mongoose.model('Staff', staff_schema);

app.get('/', function(req, res){
    res.redirect('/index');
});

app.get('/home', function(req, res){
    res.render('index.html');
});

app.get('/story/:storyName', function(req, res){
    Story.find({story_title: storyName}, function(err, data){
        if data.length != 1 {
            return console.err("wrong story request");
            res.redirect('/index');
        }
        res.render('story-page.html', {storyName: storyName, storyPath: storyName, 
                                       firstName: data[0].producer_first_name, lastName: data[0].producer_last_name,
                                       transcriptPath: data[0].transcript, imagePath: data[0].story_image, 
                                       audiopath: data[0].audio_filename})
    });
});

