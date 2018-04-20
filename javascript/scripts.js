var utils = require('./utils.js')
const fs = require('fs');

function changeDirNames() {
	var dir_list = utils.getDirectoriesRecursive('../stories')

	// Make all directory names in the correct format.
	for (i = 1; i < dir_list.length; i++) {
		var string = dir_list[i].toLowerCase().replace('../stories/', '').replace(/ /g, '-').replace(/[^\w\s-]/g, '');

		// Rename story folder names.
		fs.rename(dir_list[i], '../stories/' + string, function (err) {
  		if (err) throw err;
		  console.log('renamed complete');
		});
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
			newname = string.replace('../stories/', '').replace('/', '')
			
			// Rename each file name in the folder as foldername.extension
			fs.rename(string + file_list[j], string + newname + '.' + extension, function (err) {
				if (err) throw err;
				console.log('renamed file complete')
			})
		}
	}
}

function getFileExtension(filename) {
	return filename.split('.').pop();
}

changeDirNames()

changeFileNames()