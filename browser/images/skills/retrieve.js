var fs = require('fs')
	path = require('path');

var folders = {
	Monk: ['../action/pugilist', '../action/monk'],
	Ninja: ['../action/ninja'],
	Dragoon: ['../action/lancer', '../action/dragoon'],
	Warrior: ['../action/marauder', '../action/warrior'],
};


for(var job in folders) {
	folders[job].forEach(function(folder) {
		readFolder(job, folder);
	});
}


function readFolder(job, folder) {
	fs.readdir(folder, function(err, files) {
		if(err) throw err;
		getFiles(job, files.map(function(file) {
			return path.join(folder, file);
		}));
	})
}

function getFiles(job, files) {
	files.forEach(function(file) {
		fs.stat(file, function(err, stats) {
			if(err) throw err;
			if(stats.isDirectory()) {
				readFolder(job, file);
			} else
			if(stats.isFile()) {
				fs.createReadStream(file)
				  .pipe(fs.createWriteStream(path.join(job, path.basename(file))));
			}
		})
	});
}