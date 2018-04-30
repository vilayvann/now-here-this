const fs = require('fs');
var csv = require('csv');
const path = require('path');
var db = require('./database.js');

function undef(a, b=undefined) {
	if (b === undefined) {
		console.log(true)
	} else {
		console.log(false)
	}
}


///// Code portion used to get all directories within a directory. Thanks stackoverflow. ////////
function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}
////////////////////////////////////////////////////////////////////////////////////////

////// Code portion to read all files inside a directory. Thanks, stackoverflow. /////
function getFilesInDir(dir) {
	// So far, it's not possible to make this async.
	var res = []
	fs.readdirSync(dir).forEach(file => {
		res.push(file)
	});
	return res
}

// Indexing from 1 because the 0th index is the folder names (not file names).
// var dir_list = getDirectoriesRecursive('../stories')
// for (i = 1; i < dir_list.length; i++) {
// 	console.log(dir_list[i])
// 	var file_list = getFilesInDir(dir_list[i])
// 	console.log(file_list)
// }

// DO NOT RUN THIS FOR FUN OR FOR TESTING.
function readFromCsvAndPopulateStorySchema() {
	var readStream = fs.createReadStream('../stories.csv');
	var parser = csv.parse({columns:true});

	parser.on('readable', function() {
		while (record = parser.read()) {
			var split_producer = record.producers.split(", ")
			var split_helper = record.helpers.split(', ')
			if (record.day === '') {
				var date_produced = record.year + "-" + record.month + "-01"
			} else {
				var date_produced = record.year + "-" + record.month + "-" + record.day
			}
			// db.populateInitial(record.story_id, split_producer, split_helper, record.description, record.illustrator_credit, record.music_credit, new Date(date_produced), record.issue)

		}
	});

	parser.on('error', function(err) {
		console.log(err.message);
	});

	parser.on('finish', (function() {
		console.log('finish');
	}));

	readStream.pipe(parser);
}

// DO NOT RUN THIS FOR FUN OR FOR TESTING.
function readFromCsvAndPopulateStaffSchema() {
	var readStream = fs.createReadStream('../staff.csv');
	var parser = csv.parse({columns:true});

	parser.on('readable', function() {
		while (record = parser.read()) {
			var split_name = record.name.split(" ");
			if (split_name.length == 2) {
				var first_name = split_name[0]
				var last_name = split_name[1]
			} else {
				var first_name = split_name[0] + " " + split_name[1]
				var last_name = split_name[2]
			}

			// db.populateStaffSchema(first_name, last_name, record.role, parseInt(record.year), record.bio)
		}
	});

	parser.on('error', function(err) {
		console.log(err.message);
	});

	parser.on('finish', (function() {
		console.log('finish');
	}));

	readStream.pipe(parser);
}

// readFromCsvAndPopulateStaffSchema()
// readFromCsvAndPopulateStorySchema()

// ############################################################
exports.getDirectoriesRecursive = getDirectoriesRecursive
// #####################################

