var RotationError = require("./Errors/RotationError").RotationError,
	RotationSyntaxError = require("./Errors/RotationSyntaxError").RotationSyntaxError,
	vm = require("vm"),
	EventEmitter = require("events").EventEmitter,
	inherits = require("util").inherits,
	extend = require("util")._extend;

exports = module.exports = Rotation;

function Rotation(code) {
	EventEmitter.call(this);
	this.source = code;
}

inherits(Rotation, EventEmitter);

extend(Rotation.prototype, {

	source: null,
	script: null,
	context: null,

	prepare: function() {
		var code =  "(function () {\n" +
					this.source +
					"}());";
		try {
			this.script = vm.createScript(code);
		} catch(e) {
			this.emit("error", new RotationSyntaxError(e, arguments, this.source));
		}
		this.context = vm.createContext({
			console: console, // used for debug
		});
		return this;
	},

	run: function(actor, target, time) {
		var context = extend(this.context, {
				self: actor,
				target: target,

				AuraCount: this.AuraCount,
				IsReady: this.IsReady.bind(this, time, actor),
				IsOffGCD: this.IsOffGCD.bind(this, time, actor),
				AuraTimeRemaining: this.AuraTimeRemaining.bind(this, time),
				GCD: this.GCD.bind(this, actor),
				CooldownRemaining: this.CooldownRemaining.bind(this, time, actor),
			}),
			skillName;

		try {
			skillName = this.script.runInContext(context);
		} catch(e) {
			this.emit("error", new RotationError(e, arguments, this.source));
		}

		return skillName;
	},

	free: function() {},

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