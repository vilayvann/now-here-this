var utils = require('./utils.js')
var db = require('./database.js')

const fs = require('fs');
var pdfreader = require('pdfreader');
var stemmer = require('stemmer');
var natural = require('natural');
var keyword_extractor = require("keyword-extractor");
var unique = require('array-unique');
// var tm = require('text-miner');
const pdf = require('pdf-parse');
var pdfText = require('pdf-text')
var path = require('path');
var sleep = require('sleep');

// PDFParser = require('pdf2json');
// let pdfParser = new PDFParser(this, 1);

var storyKeywordsMap = []
var storyBufferMap = []

function changeDirNames() {
	var dir_list = utils.getDirectoriesRecursive('../stories')

	// Make all directory names in the correct format.
	for (i = 1; i < dir_list.length; i++) {
		var string = dir_list[i].toLowerCase().replace('../stories/', '').replace(/-/g, '_').replace(/[^\w\s-]/g, '');

		// Rename story folder names.
		fs.rename(dir_list[i], '../stories/' + string, function (err) {
  		if (err) throw err;
		  console.log('renamed complete');
		});
	}
}

function changeStaffPhotoNames() {
	var file_list = fs.readdirSync("../staff/")
	for (j = 0; j < file_list.length; j++) {
		var extension = getFileExtension(file_list[j])
		var newname = file_list[j].toLowerCase().replace('nht ', '').replace(' cropped', '').replace(/-/g, ' ').replace(extension, '.jpg')
		// console.log(newname)
		fs.rename('../staff/' + file_list[j], '../staff/' + newname, function (err) {
			if (err) throw err;
			console.log('renamed staff photo')
		})
	}

}

function changeFileNames() {
	var dir_list = utils.getDirectoriesRecursive('../stories')
	for (i = 1; i < dir_list.length; i++) {
		var string = dir_list[i] + "/"
		// Get all file names under each folder
		var file_list = fs.readdirSync(string)

		for (j = 0; j < file_list.length; j++) {
			// Get the extension of each file
			var extension = getFileExtension(file_list[j]).toLowerCase()
			// Get the pure folder name
			var newname = string.replace('../stories/', '').replace('/', '')
			// console.log(extension);
			
			// Rename each file name in the folder as foldername.extension
			fs.rename(string + file_list[j], string + newname + extension, function (err) {
				if (err) throw err;
				console.log('renamed file complete')
			})
		}
	}
}

function readPdf() {
	var dir_list = utils.getDirectoriesRecursive('../stories')
	folders = fs.readdirSync('../stories');
	console.log(folders)
	folders.forEach(function(folder) {
		files = fs.readdirSync('../stories/' + folder);
		files.forEach(function(file) {
			var sub = file.split('.')
			if (sub[1] == 'pdf') {
				var contents = fs.readFileSync('../stories/' + folder + '/' + file)
				pdf(contents).then(function(data) {
					var keywords = keyword_extractor.extract(data.text,{language:"english",
                                                remove_digits: true,
                                                return_changed_case:true,
                                                remove_duplicates: true,
												});
					var stemmed_keywords = keywords.map(function(word) {
						var k = stemmer(word)
						k = k.replace(/[^\w\s]/gi, '');
						return k
					});
					keywords = unique(stemmed_keywords)
					db.populateKeywords(sub[0], keywords);
				});
			}
		})
	})
}

function getFileExtension(filename_str) {
	return path.extname(filename_str)
}

// changeDirNames()

// changeFileNames()

// stemWordsFromPdfTranscript()
// readPdf()

// changeStaffPhotoNames()

// for (i in dict) {
// 	console.log("Name: " + i)
// }