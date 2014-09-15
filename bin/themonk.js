#!/usr/bin/env node

var program = require("commander"),
	fs = require("fs"),
	path = require("path"),
	TheMonk = require("../");

program
	.version(JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version)
	.option("-s, --stats <path>", "use stats from the given file", "stats.json")
	.option("-r, --rotation <path>", "use rotation from the given file", "rotation.js")
	.option("-m, --model <name>", "specify the model to use")
	.option("-t, --time <seconds>", "set the simulation duration", 60*5)
	.option("-R, --reporter <name>", "specify the reporter to use", "simpleReporter")
	.parse(process.argv);


if(fs.existsSync(program.stats)) {
	if(fs.statSync(program.stats).isFile()) {
		program.stats = fs.readFileSync(program.stats, "utf8");
		try {
			program.stats = JSON.parse(program.stats);
		} catch(e) {
			throw new Error("Error parsing stats file : " + e);
		}
	} else {
		throw new Error("'%s' is not a file", program.stats);
	}
} else {
	throw new Error("stats file '%s' does not exist", program.stats);
}

if(fs.existsSync(program.rotation)) {
	if(fs.statSync(program.rotation).isFile()) {
		program.rotation = fs.readFileSync(program.rotation, "utf8");
	} else {
		throw new Error("'%s' is not a file", program.rotation);
	}
} else {
	throw new Error("rotation file '%s' does not exist", program.rotation);
}

if(!(program.model = program.model || program.stats.model)) {
	throw new Error("please specify a model in the stats file or in the command line");
}

try {
	program.reporter = require('../reporters/' + program.reporter);
} catch (err) {
	try {
		program.reporter = require(program.reporter);
	} catch (err) {
		throw new Error("reporter '%s' does not exist", program.reporter);
	}
}

(new TheMonk).addActor(program.model, program.model, program.stats, program.rotation)
			 .setReporter(program.reporter)
			 .setMaxTime(program.time)
			 .run()
			 .report();