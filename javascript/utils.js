const fs = require('fs');
const path = require('path');

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


// ############################################################
exports.getDirectoriesRecursive = getDirectoriesRecursive
// #####################################

// TODO (vky): run this asynchronously.
// Indexing from 1 because the 0th index is the folder names (not file names).
// for (i = 1; i < dir_list.length; i++) {
// 	console.log(dir_list[i])
// 	var file_list = getFilesInDir(dir_list[i])
// 	console.log(file_list)
// }

// module.exports = {
// 	getDirectoriesRecursive: getDirectoriesRecursive(),
// 	getFilesInDir: getFilesInDir(),
// }