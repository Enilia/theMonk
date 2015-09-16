var EventEmitter = require("events").EventEmitter,
	extend = require("util")._extend,
	inherits = require("util").inherits;

exports = module.exports = Reporter;

function Reporter(theMonk, options) {
	EventEmitter.call(this);
	theMonk.on("start", this.start.bind(this));
	theMonk.on("progress", this.progress.bind(this));
	theMonk.on("end", this.end.bind(this, options));
}

inherits(Reporter, EventEmitter);

extend(Reporter.prototype, {

	startTime: null,
	duration: null,
	simDuration: null,

	// hook: function(theMonk) {
	// 	theMonk.simulation.actors.forEach(this.hookActor, this);
	// 	// else if(actors instanceof Array)
	// 	// 	actors.forEach(this.hookActor, this);
	// 	// else
	// 	// 	this.hookActor(actors);
	// },

	hookActor: function(actor) {
		actor.on(actor.events.autoattack, this.registerAutoattack.bind(this, actor.name));
		actor.on(actor.events.skill, this.registerSkill.bind(this, actor.name));
		actor.on(actor.events.auraApply, this.registerAuraApply.bind(this, actor.name));
		actor.on(actor.events.auraTick, this.registerAuraTick.bind(this, actor.name));
		actor.on(actor.events.auraRefresh, this.registerAuraRefresh.bind(this, actor.name));
		actor.on(actor.events.auraExpire, this.registerAuraExpire.bind(this, actor.name));
	},

	start: function(actors) {
		actors.forEach(this.hookActor, this);
		this.startTime = Date.now();
	},

	progress: function(time, maxTime) {

	},

	end: function(options, simDuration) {
		this.duration = Date.now() - this.startTime;
		this.simDuration = simDuration;
		this.report(options);
		this.emit("end");
	},

	reportOptions: {},

	report: function() {

	},

	registerAutoattack: function(actorName, damage, critical, time) {

	},

	registerSkill: function(actorName, damage, critical, skillName, time) {

	},

	registerAuraApply: function(actorName, auraName, time) {

	},

	registerAuraTick: function(actorName, damage, critical, auraName, time) {

	},

	registerAuraRefresh: function(actorName, auraName, time) {

	},

	registerAuraExpire: function(actorName, auraName, isExpired, time) {

	},
});

extend(Reporter, {
	createReporter: function(construtor, proto) {
		inherits(construtor, Reporter);
		extend(construtor.prototype, proto);
		return construtor;
	},
});