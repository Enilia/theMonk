var vm = require("vm"),
	EventEmitter = require("events").EventEmitter,
	inherits = require("util").inherits,
	extend = require("util")._extend;

exports = module.exports = Rotation;

function Rotation(code) {
	EventEmitter.call(this);
	code =  "use(function () {" + 
			"var use;" + 
			code +
			"}());";
	this.script = vm.createScript(code);
}

inherits(Rotation, EventEmitter);

extend(Rotation.prototype, {

	script: null,

	run: function(actor, target, time) {
		var context = {
				console: console, // used for debug

				self: actor,
				target: target,

				AuraCount: this.AuraCount,
				IsReady: this.IsReady.bind(this, time, actor),
				IsOffGCD: this.IsOffGCD.bind(this, time, actor),
				AuraTimeRemaining: this.AuraTimeRemaining.bind(this, time),
				GCD: this.GCD.bind(this, actor),
				CooldownRemaining: this.CooldownRemaining.bind(this, time, actor),
				use: use,
			},
			skillName;

		function use(s) {
			skillName = s;
		}

		try {
			this.script.runInNewContext(context);
		} catch(e) {
			// === WARNING ===
			// Errors thrown in the virtual
			// machine belongs to a very 
			// different context. Therefore
			// tests on prototype or
			// inheritance will fail even
			// when one would consider them
			// true. 
			// I.E:
			// assert(e instanceof Error)
			// will throw.
			// the following workaround can
			// be used instead :
			// assert(/^Error/.test(e.toString()))
			this.emit("error", e);
		}

		return skillName;
	},

	AuraCount: function(actor, auraName, source) {
		var aura;
		if(aura = actor.findAura(auraName, source)) {
			return aura.count;
		} else {
			return 0;
		}
	},

	IsReady: function(time, actor, skillName) {
		return actor.model.skills[skillName].isAvailable(time, actor);
	},

	IsOffGCD: function(time, actor) {
		return actor.nextOffGCD === time;
	},

	AuraTimeRemaining: function(time, actor, auraName, source) {
		var aura;
		if(aura = actor.findAura(auraName, source)) {
			return aura.expireTime - time;
		} else {
			return 0;
		}
	},

	GCD: function(actor) {
		return actor.getStats().getGCD();
	},

	CooldownRemaining: function(time, actor, skillName) {
		return actor.model.skills[skillName].cooldownRemaining(time);
	}

});