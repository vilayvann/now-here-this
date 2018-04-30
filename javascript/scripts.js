var utils = require('./utils.js')
const fs = require('fs');
// PDFParser = require('pdf2json');
// let pdfParser = new PDFParser(this, 1);
const pdf = require('pdf-parse');
var path = require('path')

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

function changeTitle(string) {
	
}




function convertPdfToJson() {
	var dir_list = utils.getDirectoriesRecursive('../stories')
	var transcript = []
	for (i = 1; i < dir_list.length; i++) {
		var string = dir_list[i] + "/"
		var newname = string.replace('../stories/', '').replace('/', '');
		
		var file_list = fs.readdirSync(string)

		if (file_list.indexOf(newname + '.pdf') != -1) {
			var dataBuffer = fs.readFileSync(string + newname + '.pdf');
			console.log('EXIST' + string)
			// console.log(dataBuffer)
			pdf(dataBuffer).then(function(data) {
				// transcript.push(data.text)
				// console.log(data.text);
				// dict[newname] = data.text;
				console.log('******************************')
				console.log(data.text);
			})
		} else {
			console.log(string)
		}
		console.log
	}
	console.log(transcript.length)
}

function getFileExtension(filename_str) {
	return path.extname(filename_str)
}

// changeDirNames()

// changeFileNames()

// convertPdfToJson()

changeStaffPhotoNames()

// for (i in dict) {
// 	console.log("Name: " + i)
// }