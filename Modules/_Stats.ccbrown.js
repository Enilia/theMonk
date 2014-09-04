var extend = require("util")._extend,
	Stats = require('./Stats');

exports = module.exports = Stats;

delete require.cache[__filename];

extend(Stats.prototype, {

	formulas: "ccbrown",

	getSkillDamage: function (fPotency) {
		// https://github.com/ccbrown/xiv-sim/blob/master/src/models/Monk.cpp
		return (fPotency/100) * (
			this.weaponDamage * (
				this.strength * 0.00389 + this.determination * 0.0008 + 0.01035
			) + (this.strength * 0.08034) + (this.determination * 0.02622)
		)*(1+(0.5*this.getCriticalRate()))*this.increaseDamage;
	},

	getAutoAttackDamage: function () {
		// https://github.com/ccbrown/xiv-sim/blob/master/src/models/Monk.cpp
		return this.weaponAutoAttackDelay / 3.0 * (
			this.weaponDamage * (
				this.strength * 0.00408 + this.determination * 0.00208 - 0.30991
			) + (this.strength * 0.07149) + (this.determination * 0.03443)
		)*(1+(0.5*this.getCriticalRate()))*this.increaseDamage;
	},
});