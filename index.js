var express = require('express'),
    bp = require('body-parser'),
    hogan = require('hogan.js'),
    stemmer = require('stemmer');
    engines = require('consolidate'),
    mongoose = require('mongoose');

var app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());
app.use(express.static('./'));

app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');

mongoose.connect('mongodb://now-here-this:nowherethisboringpassword2018@ds255347.mlab.com:55347/now-here-this');

var story_schema = new mongoose.Schema({
	story_id: String, //story folder name, for example, aqua_life_central
    story_name: String, // story real name, for example, aqua life central, or we could format the story name from frony end
    producers: [String], // for example, [Jason Goettisheim, Sebastian Lucek]. Using ", " to seperate each name.
    helpers: [String], // the format is same as producers
    description: String,
    illustrator_credit: String,
    music_credit: String,
    date_produced: String,
    // keywords_in_transcript: [ String ], // implement later
    issue_id: Number, // stories without an issue have id 0, else it's 1, 2, ...
    transcript: Number,
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

var keywords_schema = new mongoose.Schema({
    story_id: String,
    story_name: String,
    keywords: [ String ]
});

var Keywords = mongoose.model('Keywords', keywords_schema);

app.get('/', function(req, res){
    res.redirect('/index.html');
});

app.post('/results.html', function(req, res) {
    console.log(req.body.searchInput)
    words = req.body.searchInput.toLowerCase().split(' ')
    // search_string = search_string.toLowerCase()

    // var words = search_string.split(' ')
    // stem those words.
    var stemmed = words.map(function(word) {
        var new_word = stemmer(word)
        return new_word
    });

    Keywords.find().or([{ story_id: { $regex: stemmed, $options: "$i" }}, { keywords: { $in: stemmed }}]).exec(
        function (err, data) {
            var stories = "";
            // console.log(data)
            if (err) {
                console.log(err)
            }

                

            for (var i = 0; i < data.length; i++) {
                if (i % 4 == 0) {
                    stories += "<div class='row'>";
                }

                var name = data[i].story_id.split('_').join(' ');
                if (data[i].story_id == '5am_rockefeller_library')
                    name = '5am, rockefeller library'
                if (data[i].story_id == 'dont_drink_the_water')
                    name = "don't drink the water"
                if (data[i].story_id == 'mens_story_project')
                    name = "men's story project"
                if (data[i].story_id == 'whats_really_scary')
                    name = "what's really scary"
                stories += "<div class='col-3'><div class='stories'><a href='/" + data[i].story_id + "'><img src='../stories/" + data[i].story_id + "/" + data[i].story_id + ".jpg' class='story-images'></a><h6>" + name + "</h6></div></div>"
                if (i % 4 == 3 || i == data.length - 1) {
                    stories += "</div>";
                }
            }

            res.render('results.html', {stories: stories})
        }); 
    
});

app.get('/index.html', function(req, res){
    Story.find({}, function(err, data){
        var stories = "";
        for (var i = 0; i < data.length; i++) {
            stories += "<div class='col-md-3 col-6'><div class='stories'><a href='/" + data[i].story_id + "'><img src='../stories/" + data[i].story_id + "/" + data[i].story_id + ".jpg' class='story-images'></a><h6>" + data[i].story_name + "</h6></div></div>"
        }
        res.render('index.html', {stories: stories});
    }).limit(4).sort({date_produced: -1});
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
            // var storyName = data[i].story_id.split('_').join(' ');
            stories += "<div class='col-md-3 col-6'><div class='stories'><a href='/" + data[i].story_id + "'><img src='../stories/" + data[i].story_id + "/" + data[i].story_id + ".jpg' class='story-images'></a><h6>" + data[i].story_name + "</h6></div></div>"
            if (i % 4 == 3 || i == data.length - 1) {
                stories += "</div>";
            }
        }
        res.render('archive.html', {stories: stories});
    }).sort({date_produced: -1});
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
            var path = data[i].name;
            var lower = path.toLowerCase();
            staff += "<div class='col-md-3 col-6'><div class='stories'><a href='/" + path + "'><img src='../staff/" + lower + ".jpg' class='story-images'></a><h6>" + data[i].name + "</h6></div></div>"
            if (i % 4 == 3 || i == data.length - 1) {
                staff += "</div>";
            }
        }
        res.render('staff.html', {staff: staff});
    });
});

app.get('/:storyName', function(req, res){
    var storyName = req.params.storyName;
    Story.findOne({story_id: storyName}, function(err, data){
        if (data == null) {
            var staffName = storyName;
                Staff.find({name: staffName}, function(err, data){
                    if (data.length < 1) {
                        res.redirect('/index.html');
                        return;
                    }
                    var name = data[0].name;
                    var nameLower = staffName.toLowerCase();
                    Story.find({producers: name}, function(err, data2){
                        var stories = "";
                        if (data2.length > 0) {
                            var stories = "<div class='row headers'><div class='col-12'><h3 class='header-text'><span class='header-span'>Stories</span></h3></div></div>";
                            for (var i = 0; i < data2.length; i++) {
                                if (i % 4 == 0) {
                                    stories += "<div class='row'>";
                                }
                                // var storyName = data2[i].story_id.split('_').join(' ');
                                stories += "<div class='col-3'><div class='stories'><a href='/" + data2[i].story_id + "'><img src='../stories/" + data2[i].story_id + "/" + data2[i].story_id + ".jpg' class='story-images'></a><h6>" + data2[i].story_name + "</h6></div></div>"
                                if (i % 4 == 3 || i == data2.length - 1) {
                                    stories += "</div>";
                                }
                            }
                            stories += "</div>";
                        }
                        res.render('staff-page.html', {staffName: nameLower, name: name, role: data[0].role, year: data[0].year, intro: data[0].bio, stories: stories});
                    });
                })
        } else {
            var story_decription ="";
            var music_credit="";
            var transcript="";
            if (data.description!="") { 
                story_decription += "<div>Description: "+ data.description+"</div>"
            } 
            if (data.music_credit!="") {
                music_credit  += "<div>Music Credit: " + data.music_credit+ "</div>"
            }
            if (data.transcript==1) {
                transcript += "<center><iframe src='../stories/"+ data.story_id+"/"+data.story_id +".pdf' frameborder='0' width='600px' height='600px'></iframe></center>"
            } else {
                transcript += "<p class='middle'>Still working on this...</p>"
            }
            // var storyNameParsed = storyName.split('_').join(' ');
            res.render('story-page.html', {storyName: data.story_name, storyPath: storyName,
                                       producers: data.producers, intro: story_decription, music: music_credit, transcript:transcript})
            
        }

    });
});

var server = app.listen(8080, function(){
  console.log('Server is listening on port 8080');
});

exports.closeServer = function(){
  server.close();
};
