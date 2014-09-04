var vm = require("vm"),
	extend = require("util")._extend;

exports = module.exports = Rotation;

// function Rotation(filename) {
// 	var code = "use(function () {" + 
// 		"var use;" + 
// 		fs.readFileSync(filename, "utf8") +
// 		"}());";
// 	this.script = vm.createScript(code);
// }

function Rotation(code) {
	code =  "use(function () {" + 
			"var use;" + 
			code +
			"}());";
	this.script = vm.createScript(code);
}

extend(Rotation.prototype, {

	script: null,

	run: function(actor, target, time) {
		var skillName;

		function use(s) {
			skillName = s;
		}

		this.script.runInNewContext({

			console: console, // used for debug

			self: actor,
			target: target,

			AuraCount: this.AuraCount,
			IsReady: this.IsReady.bind(this, time, actor),
			IsOffGCD: this.IsOffGCD.bind(this, time, actor),
			AuraTimeRemaining: this.AuraTimeRemaining.bind(this, time),
			use: use,

		});

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
		return actor.model.skills[skillName].isAvailable(time);
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

});