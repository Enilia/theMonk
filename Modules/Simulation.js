var extend = require("util")._extend,
	Scheduled = require("./Scheduled2"),
	Actor = require("./Actor");

exports = module.exports = Simulation;

function Simulation(conf) {
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

extend(Simulation.prototype, {

	scheduled: null,
	actors: null,
	target: null,
	reporter: null,

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

		while(next = scheduled.next()) {
			next();
			actors.forEach(function(actor) {
				scheduled.register("checkActors", this.checkActors, actor.nextTimeOfInterest(scheduled.time), this);
			}, this);
		};

		reporter && reporter.end(scheduled.maxTime);
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
		this.target.preTick(this.scheduled.time);
		this.actors.forEach(function(actor) {
			if(actor.nextTimeOfInterest(this.scheduled.time) <= 0) {
				actor.action(this.scheduled.time, this.target);
			}
		}, this);
	},

})