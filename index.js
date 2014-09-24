var util = require("util"),
	format = util.format,
	extend = util._extend,
	inherits = util.inherits,
	EventEmitter = require("events").EventEmitter,
	Actor = require('./Modules/Actor'),
	Simulation = require("./Modules/Simulation"),
	Stats = require("./Modules/Stats");

exports = module.exports = theMonk;

function theMonk(options) {
	EventEmitter.call(this);
	options = options || {};
	this.actors = [];
	// this.setReporter(options.reporter);
	// options.actors && this.addActors(options.actors);
}

inherits(theMonk, EventEmitter);

extend(theMonk.prototype, {

	simulation: null,
	// reporter: null,
	actors: null,

	maxTime: 60*3,

	addActor: function(model, name, stats, rotation) {
		var actor;

		if(this.actors.some(function(actor) {
			return actor.name === name;
		})) {
			this.emit("warn", format("duplicate Actor '%s'. this may leads in unexpected results in reporter", name));
		}

		actor = new Actor({
			model: model,
			name: name,
			stats: stats,
			rotation: rotation,
		});

		actor.on("error", function(e) {
			this.cancel();
			this.emit("error", e);
		}.bind(this));

		this.actors.push(actor);

		return this;
	},

	addActors: function(actors) {
		actors.forEach(function(actor) {
			this.addActor.apply(this, actor);
		}, this);

		return this;
	},

	// setReporter: function(reporter) {
	// 	reporter = reporter || "simpleReporter";

	// 	if("function" == typeof reporter) {
	// 		this.reporter = new reporter;
	// 	} else {
	// 		try {
	// 			this.reporter = new (require('./Reporters/'+reporter));
	// 		} catch(err) {
	// 			try {
	// 				this.reporter = new (require(reporter));
	// 			} catch(err) {
	// 				this.emit("error", new Error('invalid reporter "' + reporter + '"'));
	// 			}
	// 		}
	// 	}

	// 	return this;
	// },

	setMaxTime: function(time) {
		this.maxTime = time;
		return this;
	},

	run: function() {

		this.simulation = new Simulation({
			actors: this.actors,
			// reporter: this.reporter,
			Scheduled: {
				maxTime: this.maxTime,
			}
		});

		this.simulation.run();
		this.simulation.on("end", this.emit.bind(this, "end", this));

		return this;
	},

	cancel: function() {
		if(this.simulation) {
			this.simulation.cancel();
			this.simulation.end();
		}
		return this;
	},

	// report: function(options) {

	// 	this.reporter.report(options);

	// 	return this;
	// },

	useValkkyFormulas: function() {
		Stats.useValkkyFormulas();
		return this;
	},

	useCcbrownFormulas: function() {
		Stats.useCcbrownFormulas();
		return this;
	},

});