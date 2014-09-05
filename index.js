var Actor = require('./Modules/Actor'),
	Simulation = require("./Modules/Simulation"),
	Stats = require("./Modules/Stats"),
	extend = require("util")._extend;

exports = module.exports = theMonk;

function theMonk(options) {
	options = options || {};
	this.actors = [];
	this.setReporter(options.reporter);
	options.actors && this.addActors(options.actors);
}

extend(theMonk.prototype, {

	simulation: null,
	reporter: null,
	actors: null,

	maxTime: 60*3,

	addActor: function(model, name, stats, rotation) {
		if(this.actors.some(function(actor) {
			return actor.name === name;
		})) {
			console.warn("duplicate Actor '%s'. this may leads in unexpected results in reporter", name);
		}

		this.actors.push(new Actor({
			model: model,
			name: name,
			stats: stats,
			rotation: rotation,
		}));

		return this;
	},

	addActors: function(actors) {
		actors.forEach(function(actor) {
			this.addActor.apply(this, actor);
		}, this);

		return this;
	},

	setReporter: function(reporter) {
		reporter = reporter || "simpleReporter";

		if("function" == typeof reporter) {
			this.reporter = new reporter;
		} else {
			try {
				this.reporter = new (require('./Reporters/'+reporter+'.reporter'));
			} catch(err) {
				try {
					this.reporter = new (require(reporter));
				} catch(err) {
					throw new Error('invalid reporter "' + reporter + '"');
				}
			}
		}

		return this;
	},

	setMaxTime: function(time) {
		this.maxTime = time;
		return this;
	},

	run: function() {

		this.simulation = new Simulation({
			actors: this.actors,
			reporter: this.reporter,
			Scheduled: {
				maxTime: this.maxTime,
			}
		});

		this.simulation.run();

		return this;
	},

	report: function(options) {

		this.reporter.report(options);

		return this;
	},

	useValkkyFormulas: function() {
		Stats.useValkkyFormulas();
		return this;
	},

	useCcbrownFormulas: function() {
		Stats.useCcbrownFormulas();
		return this;
	},

});