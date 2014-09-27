#!/usr/bin/env node

// example
// themonk -s Rotations\Enilia.stats.json -r Rotations\monk_2.rotation.js -t 180 -o "Summary|Damage"

var fs = require("fs"),
	path = require("path"),
	// format = require("util").format,
	program = require("commander"),
	TheMonk = require("../");

program
	.version(JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version)
	.option("-s, --stats <path=stats.json>", "use stats from the given file", "stats.json")
	.option("-r, --rotation <path=rotation.js>", "use rotation from the given file", "rotation.js")
	.option("-m, --model <name>", "specify the model to use")
	.option("-t, --time <seconds>", "set the simulation duration", 60*5)
	.option("-R, --reporter <name=simpleReporter>", "specify the reporter to use", "simpleReporter")
	.option("-o, --reporter-options <options>", "specify the options to use in reporter")
	.parse(process.argv);


if(fs.existsSync(program.stats)) {
	if(fs.statSync(program.stats).isFile()) {
		var statsFileName = program.stats;
		try {
			program.stats = fs.readFileSync(program.stats, "utf8");
		} catch(e) {
			console.error("\nError reading %s : \n\n\t%s", statsFileName, e.message);
			process.exit(1);
		}
		try {
			program.stats = JSON.parse(program.stats);
		} catch(e) {
			console.error("\nError parsing %s : \n\n\t%s", statsFileName, e.message);
			process.exit(1);
		}
	} else {
		console.error("\n'%s' is not a file", program.stats);
		process.exit(1);
	}
} else {
	console.error("\n'%s' does not exist", program.stats);
	process.exit(1);
}

if(fs.existsSync(program.rotation)) {
	if(fs.statSync(program.rotation).isFile()) {
		program.rotation = fs.readFileSync(program.rotation, "utf8");
	} else {
		console.error("\n'%s' is not a file", program.rotation);
		process.exit(1);
	}
} else {
	console.error("\n'%s' does not exist", program.rotation);
	process.exit(1);
}

if(!(program.model = program.model || program.stats.model)) {
	console.error("\nplease specify a model in the stats file or in the command line");
	process.exit(1);
}

try {
	program.reporter = require('../lib/reporters/' + program.reporter);
} catch (err) {
	try {
		program.reporter = require(program.reporter);
	} catch (err) {
		console.error("\nreporter '%s' does not exist", program.reporter);
		process.exit(1);
	}
}

if(program.reporterOptions) {
	program.reporterOptions = program.reporterOptions.split(/&|, ?|\|/).reduce(function(p, c) {
		var opt = program.reporter.prototype.reportOptions[c];
		if(!opt) {
			console.error("\nreporter option '%s' does not exist", c);
			process.exit(1);
		}
		return p | opt;
	}, 0);
}

var themonk = new TheMonk().on("error", function(e) {
					switch(e.name) {
						case "RotationError":
						case "RotationSyntaxError":
							console.error(e.stack);
							// console.error(e.error.stack);
							break;
						default:
							console.error(e.stack);
					}
					process.exit(1);
				})
				.on("warn", function(warn) {
					console.warn(warn);
				});

new program.reporter(themonk, program.reporterOptions);

process.on('SIGINT', function() {
	themonk.cancel();
	process.nextTick(function() {
		process.exit(1);
	});
});

themonk.addActor(program.model, program.model, program.stats, program.rotation)
		// .setReporter(program.reporter)
		.setMaxTime(program.time)
		.run()
		.on("end", function(duration) {
			// simulation.report(program.reporterOptions);
		});

