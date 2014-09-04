var extend = require("util")._extend;

exports = module.exports = Reporter;

function Reporter(conf) {

}

extend(Reporter.prototype, {

	startTime: null,
	duration: null,
	simDuration: null,

	hook: function(actors) {
		if(actors instanceof Array)
			actors.forEach(this._hook, this);
		else
			this._hook(actors);
	},

	_hook: function(actor) {
		actor.on(actor.events.autoattack, this.registerAutoattack.bind(this, actor.name));
		actor.on(actor.events.skill, this.registerSkill.bind(this, actor.name));
		actor.on(actor.events.auraApply, this.registerAuraApply.bind(this, actor.name));
		actor.on(actor.events.auraTick, this.registerAuraTick.bind(this, actor.name));
		actor.on(actor.events.auraRefresh, this.registerAuraRefresh.bind(this, actor.name));
		actor.on(actor.events.auraExpire, this.registerAuraExpire.bind(this, actor.name));
	},

	start: function() {
		this.startTime = Date.now();
	},

	end: function(simDuration) {
		this.duration = Date.now() - this.startTime;
		this.simDuration = simDuration;
	},

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