var utils = require('./utils.js')
const fs = require('fs');

function changeDirNames() {
	var dir_list = utils.getDirectoriesRecursive('../stories')

	// Make all directory names in the correct format.
	for (i = 1; i < dir_list.length; i++) {
		var string = dir_list[i].toLowerCase().replace('../stories/', '').replace(/ /g, '-').replace(/[^\w\s-]/g, '');
		console.log(string)

		// Rename story folder names.
		fs.rename(dir_list[i], '../stories/' + string, function (err) {
  		if (err) throw err;
		  console.log('renamed complete');
		});
	}
}
changeDirNames()