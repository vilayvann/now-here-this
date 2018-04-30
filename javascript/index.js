var express = require('express'),
    bp = require('body-parser'),
    hogan = require('hogan.js'),
    engines = require('consolidate'),
    mongoose = require('mongoose');

var app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());
app.use(express.static('../'));

app.engine('html', engines.hogan);
app.set('views', __dirname + '/../templates');
app.set('view engine', 'html');

mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');

var story_schema = new mongoose.Schema({
	story_id: String, //story folder name, for example, aqua_life_central
    // story_name: String, // story real name, for example, aqua life central, or we could format the story name from frony end
    producers: [String], // for example, [Jason Goettisheim, Sebastian Lucek]. Using ", " to seperate each name.
    helpers: [String], // the format is same as producers
    description: String,
    illustrator_credit: String,
    music_credit: String,
    date_produced: String,
    // keywords_in_transcript: [ String ], // implement later
    issue_id: Number, // stories without an issue have id 0, else it's 1, 2, ...
    // issue_name: String, 
    meta: {
        views: Number, // optional
        shares: Number // optional
    }
});

var Story = mongoose.model('Story', story_schema);

var staff_schema = new mongoose.Schema({
    name: String,
    role: String,
    year: Number,
    bio: String
});

var Staff = mongoose.model('Staff', staff_schema);

app.get('/', function(req, res){
    res.redirect('/index.html');
});

app.get('/index.html', function(req, res){
    Story.find({}, function(err, data){
        var stories = "";
        for (var i = 0; i < data.length; i++) {
            var storyName = data[i].story_id.split('_').join(' ');
            stories += "<div class='col-3'><div class='stories'><a href='/" + data[i].story_id + "'><img src='../stories/" + data[i].story_id + "/" + data[i].story_id + ".jpg' class='story-images'></a><h6>" + storyName + "</h6></div></div>"
        }
        res.render('index.html', {stories: stories});
    }).limit(4);
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
            var storyName = data[i].story_id.split('_').join(' ');
            stories += "<div class='col-3'><div class='stories'><a href='/" + data[i].story_id + "'><img src='../stories/" + data[i].story_id + "/" + data[i].story_id + ".jpg' class='story-images'></a><h6>" + storyName + "</h6></div></div>"
            if (i % 4 == 3 || i == data.length - 1) {
                stories += "</div>";
            }
        }
        res.render('archive.html', {stories: stories});
    });
});

app.get('/issues.html', function(req, res){
    res.render('issues.html');
});

app.get('/staff.html', function(req, res){
    Staff.find({}, function(err, data){
        var staff = "";
        for (var i = 0; i < data.length; i++) {
            if (i % 4 == 0) {
                staff += "<div class='row'>";
            }
            // console.log(data[i].role);
            var path = data[i].name;
            // console.log(path);
            var lower = path.toLowerCase();
            staff += "<div class='col-3'><div class='stories'><a href='/" + path + "'><img src='../staff/" + lower + ".jpg' class='story-images'></a><h6>" + data[i].name + "</h6></div></div>"
            if (i % 4 == 3 || i == data.length - 1) {
                staff += "</div>";
            }
        }
        res.render('staff.html', {staff: staff});
    });

});

app.get('/subscribe.html', function(req, res){
    res.render('subscribe.html');
});


app.get('/:storyName', function(req, res){
    var storyName = req.params.storyName;
    Story.findOne({story_id: storyName}, function(err, data){
        if (data == null) {
            console.log(storyName);
            var staffName = storyName;
                // var arr = staffName.split('-');

                Staff.find({name: staffName}, function(err, data){
                    if (data.length < 1) {
                        res.redirect('/index.html');
                        return;
                    }
                    var name = data[0].name;
                    var nameLower = staffName.toLowerCase();
                     if (data[0].role == 'Producer'){
                         Story.find({producer_first_name: arr[0], producer_last_name: arr[1]}, function(err, data2){
                             var stories = "";
                             if (data2.length > 0) {
                                 var stories = "<div class='row headers'><div class='col-12'><h3 class='header-text'><span class='header-span'>Stories</span></h3></div></div>";
                                 for (var i = 0; i < data2.length; i++) {
                                     if (i % 4 == 0) {
                                         stories += "<div class='row'>";
                                     }
                                     stories += "<div class='col-3'><div class='stories'><a href='/stories/" + data2[i].story_id + "'><img src='../stories/" + data2[i].story_id + "/" + data2[i].story_id + ".jpg' class='story-images'></a><h6>" + data2[i].story_id + "</h6></div></div>"
                                     if (i % 4 == 3 || i == data2.length - 1) {
                                         stories += "</div>";
                                     }
                                 }
                                 stories += "</div>";
                             }
                             res.render('staff-page.html', {staffName: nameLower, name: name, role: data[0].role, year: data[0].year, intro: data[0].bio, stories: stories});
                         });

                     } else {
                        res.render('staff-page.html', {staffName: nameLower, name: name, role: data[0].role, year: data[0].year, intro: data[0].bio, stories: ""});
                     }
                });
        } else {
            var storyNameParsed = storyName.split('_').join(' ');
            // console.log(data.m)
            res.render('story-page.html', {storyName: storyNameParsed, storyPath: storyName,
                                       producers: data.producers, intro: data.description, music: data.music_credit})
        }

    });
});



app.listen(8080);
