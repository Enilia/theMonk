var util = require("util"),
	format = util.format,
	extend = util._extend,
	inherits = util.inherits,
	EventEmitter = require("events").EventEmitter,
	Actor = require('./lib/Actor'),
	Simulation = require("./lib/Simulation"),
	Stats = require("./lib/Stats"),
	setImmediate = global.setImmediate || process.nextTick;

exports = module.exports = theMonk;

function theMonk() {
	EventEmitter.call(this);

	this.simulation = new Simulation();
	this.simulation.on("start", this.emit.bind(this, "start"));
	this.simulation.on("progress", this.emit.bind(this, "progress"));
	this.simulation.on("end", this.emit.bind(this, "end"));
}

inherits(theMonk, EventEmitter);

extend(theMonk.prototype, {

	simulation: null,

	hasActor: function(name) {
		return this.simulation.actors.some(function(actor) {
			return actor.name === name;
		});
	},

	addActor: function(model, name, stats, rotation) {
		var actors = this.simulation.actors;

		if(this.hasActor(name)) {
			this.emit("warn", format("Duplicate Actor '%s'.", name));
		}

		actors.push(new Actor({
			model: model,
			name: name,
			stats: stats,
			rotation: rotation,
		}).on("error", function(e) {
			this.cancel();
			this.emit("error", e);
		}.bind(this)));

		return this;
	},

	addActors: function(actors) {
		actors.forEach(function(actor) {
			this.addActor.apply(this, actor);
		}, this);

		return this;
	},

	setMaxTime: function(time) {
		this.simulation.scheduled.maxTime = time;
		return this;
	},

	run: function() {

		setImmediate(this.simulation.run.bind(this.simulation));

		return this;
	},

	cancel: function() {
		this.simulation.cancel();
		this.simulation.end();
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