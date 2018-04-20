//var utils = require('./utils.js');
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
app.use(express.static('../'));

app.engine('html', engines.hogan);
app.set('views', __dirname + '/../templates');
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
    res.redirect('/index.html');
});

app.get('/index.html', function(req, res){
    res.render('index.html');
});

app.get('/overview.html', function(req, res){
    res.render('overview.html');
});

app.get('/contact.html', function(req, res){
    res.render('contact.html');
});

app.get('/archive.html', function(req, res){
    Story.find({}, function(err, data){
        var stories = "";
        for (var i = 0; i < data.length; i++) {
            if (i % 4 == 0) {
                stories += "<div class='row'>";
            }
            stories += "<div class='col-3'><div class='stories'><a href='/stories/" + data[i].story_title + "'><img src='../stories/" + data[i].story_title + "/" + data[i].story_title + ".jpg' class='story-images'><h6>" + data[i].story_title + "</h6></div></div>"
            if (i % 4 == 3 || i == data.length - 1) {
                stories += "</div>";
            }
        }
        res.render('archive.html', {stories: stories});
    });
});

app.get('/issue.html', function(req, res){
    res.render('issue.html');
});

app.get('/staff.html', function(req, res){
    res.render('staff.html');
});

app.get('/subscribe.html', function(req, res){
    res.render('subscribe.html');
});


app.get('/stories/:storyName', function(req, res){
    var storyName = req.params.storyName;
    Story.findOne({story_title: storyName}, function(err, data){   
        if (data == null) {
            return console.log("wrong story request");
            res.redirect('/index.html');
        }
        res.render('story-page.html', {storyName: storyName, storyPath: storyName, 
                                       firstName: data.producer_first_name, lastName: data.producer_last_name})
    });
//    res.render('story-page.html');
});

app.get('/staff/:staffName', function(req, res){
    var staffName = req.params.staffName;
    var arr = staffName.split('-');
    Staff.find({first_name: arr[0], last_name: arr[1]}, function(err, data){
        if (data.length != 1) {
            return console.log("wrong staff request");
            res.redirect('/index');
        }
        var name = data[0].first_name + data[0].last_name;
        if (data[0].role == 'Producer'){
            Story.find({producer_first_name: arr[0], producer_last_name: arr[1]}, function(err, data2){
                var stories = "";
                if (data2.length > 0) {
                    var stories = "<div class='row headers'><div class='col-12'><h3 class='header-text'><span class='header-span'>Stories</span></h3></div></div>";
                    for (var i = 0; i < data2.length; i++) {
                        if (i % 4 == 0) {
                            stories += "<div class='row'>";
                        }
                        stories += "<div class='col-3'><div class='stories'><a href='/stories/" + data2[i].story_title + "'><img src='../stories/" + data2[i].story_title + "/" + data2[i].story_title + ".jpg' class='story-images'><h6>" + data2[i].story_title + "</h6></div></div>"
                        if (i % 4 == 3 || i == data2.length - 1) {
                            stories += "</div>";
                        }
                    }
                    stories += "</div>";
                }
            });
            res.render('staff-page.html', {name: name, role: data[0].role, year: data[0].year, intro: data[0].bio, stories: stories});
        } else {
            res.render('staff-page.html', {name: name, role: data[0].role, year: data[0].year, intro: data[0].bio, stories: ""});
        }
    });
})



app.listen(8080);
