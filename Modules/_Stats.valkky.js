var extend = require("util")._extend,
	Stats = require('./Stats');

exports = module.exports = Stats;

delete require.cache[__filename];

extend(Stats.prototype, {

	formulas: "valkky",

	getSkillDamage: function (fPotency) {
		// http://valk.dancing-mad.com/methodology/#FinalFormulas
		return (fPotency/100)*(
			((0.0032*this.strength+0.4162)*this.weaponDamage)
			+(0.1*this.strength-0.3529)
			+((this.determination-202)*0.035)
		)*(1+(0.5*this.getCriticalRate()))*this.increaseDamage;
	},

	getAutoAttackDamage: function () {
		// http://valk.dancing-mad.com/methodology/#FinalFormulas
		return (this.weaponAutoAttack/this.weaponDamage)*(
			((0.0032*this.strength+0.4162)*this.weaponDamage)
			+(0.1*this.strength-0.3529)
			+((this.determination-202)*0.11)
		)*(1+(0.5*this.getCriticalRate()))*this.increaseDamage;
	},
});