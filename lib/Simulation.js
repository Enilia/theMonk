var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Scheduled = require("./Scheduled2"),
	Actor = require("./Actor"),
	setImmediate = global.setImmediate || process.nextTick;

exports = module.exports = Simulation;

function Simulation() {
	EventEmitter.call(this);

	this.scheduled = new Scheduled();
	this.target = new Actor({
		model: "Monk",
		name: "Target",
		inactive: true,
	});
	this.actors = [this.target];
}

inherits(Simulation, EventEmitter);

extend(Simulation.prototype, {

	scheduled: null,
	actors: null,
	target: null,
	stopped: false,

	run: function() {
		var scheduled = this.scheduled,
			actors = this.actors,
			target = this.target,
			next;

		this.emit("start", actors);

		scheduled.register("tick", this.tick, 3, this);
		scheduled.register("checkActors", this.checkActors, 0, this);

		actors.forEach(function(actor) {
			actor.prepareForBattle(scheduled.time);
		}, this);

		setImmediate(this.loop.bind(this));
	},

	loop: function() {
		if(this.stopped) return;
		if(next = this.scheduled.next()) {
			next();
			this.actors.forEach(function(actor) {
				this.scheduled.register("checkActors", this.checkActors, actor.nextTimeOfInterest(this.scheduled.time), this);
			}, this);
			setImmediate(this.loop.bind(this));
		} else {
			setImmediate(this.end.bind(this));
		}
	},

	end: function() {
		this.emit("end", Math.min(this.scheduled.maxTime, this.scheduled.time));
	},

	cancel: function() {
		this.stopped = true;
	},

	tick: function() {
		this.actors.forEach(function(actor) {
			actor.preTick(this.scheduled.time);
		}, this);
		this.actors.forEach(function(actor) {
			actor.tick(this.scheduled.time);
		}, this);
		this.scheduled.register("tick", this.tick, 3, this);
	},

	checkActors: function() {
		this.actors.forEach(function(actor) {
			actor.preTick(this.scheduled.time);
		}, this);
		
		this.actors.forEach(function(actor) {
			if(this.stopped) return;
			if(actor.nextTimeOfInterest(this.scheduled.time) <= 0) {
				actor.action(this.scheduled.time, this.target);
			}
		}, this);
	},

})