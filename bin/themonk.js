#!/usr/bin/env node

var program = require("commander"),
	fs = require("fs"),
	TheMonk = require("../");

program
	.version(JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version)
	.option("-s, --stats <path>", "use stats from the given file")
	.parse(process.argv);