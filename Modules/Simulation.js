var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Scheduled = require("./Scheduled2"),
	Actor = require("./Actor");

exports = module.exports = Simulation;

function Simulation(conf) {
	EventEmitter.call(this);

	this.scheduled = new Scheduled(conf.Scheduled);
	this.actors = conf.actors || [];
	this.target = new Actor({
		model: "Monk",
		name: "Target",
		inactive: true,
	});
	this.reporter = conf.reporter;

	this.actors.push(this.target);
}

inherits(Simulation, EventEmitter);

extend(Simulation.prototype, {

	scheduled: null,
	actors: null,
	target: null,
	reporter: null,
	stopped: false,

	run: function() {
		var scheduled = this.scheduled,
			reporter = this.reporter,
			actors = this.actors,
			target = this.target,
			next;

		reporter && reporter.hook(actors);

		scheduled.register("tick", this.tick, 3, this);
		scheduled.register("checkActors", this.checkActors, 0, this);

		actors.forEach(function(actor) {
			actor.prepareForBattle(scheduled.time);
		}, this);

		reporter && reporter.start();

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
		this.reporter && this.reporter.end(this.scheduled.maxTime);
		this.emit("end");
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
			if(actor.nextTimeOfInterest(this.scheduled.time) <= 0) {
				actor.action(this.scheduled.time, this.target);
			}
		}, this);
	},

})