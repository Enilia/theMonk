var extend = require("util")._extend,
	baseStatsMultiplier = {
		weaponDamage: 1,
		weaponAutoAttack: 1,
		weaponAutoAttackDelay: 1,
		strength: 1,
		critical: 1,
		determination: 1,
		skillSpeed: 1,
		increaseDamage: 1,
		transformIncomingDamage: 1,
	},
	baseStatsIncrease = {
		criticalHitChance: 0,
		skillCriticalHitChance: 0,
		increasedAutoAttackSpeed: 0,
		reducedGlobalCooldown: 0,
	},
	baseResists = {
		BLUNT: 		1,
		SLASH: 		1,
		PIERCING: 	1,
		MAGIC: 		1,
	};

exports = module.exports = Stats;

function Stats (stats) {
	for (var stat in stats) {
		if(stat in baseStatsMultiplier ||
		   stat in baseStatsIncrease ||
		   stat in baseResists)
			this[stat] = stats[stat];
	}
}

extend(Stats.prototype, baseStatsMultiplier);
extend(Stats.prototype, baseStatsIncrease);
extend(Stats.prototype, baseResists);
extend(Stats.prototype, {
	/*
		fPotency: [0.0,inf[
	*/
	getSkillDamage: function (fPotency) {
	},

	/*
		
	*/
	getAutoAttackDamage: function () {
	},

	getCriticalRate: function() {
		return Math.max(Math.min((0.0697*this.critical-18.437)/100+this.criticalHitChance, 1), 0);
	},

	getSkillCriticalRate: function() {
		return Math.max(Math.min((0.0697*this.critical-18.437)/100+this.criticalHitChance+this.skillCriticalHitChance, 1), 0);
	},

	/*
	*/
	getGCD: function () {
		return (2.49-((this.skillSpeed-344)*0.01/10.5))*(1-this.reducedGlobalCooldown);
	},

	/*
	*/
	getAutoAttackDelay: function () {
		return this.weaponAutoAttackDelay*(1-this.increasedAutoAttackSpeed);
	},

	buff: function (multiplier) {
		var stats = new Stats(this),
			stat;

		for (stat in multiplier) {
			if(stat in baseStatsMultiplier)
				stats[stat] *= multiplier[stat];
			if(stat in baseStatsIncrease)
				stats[stat] += multiplier[stat];
			if(stat in baseResists)
				stats[stat] = multiplier[stat];
		}
		return stats;
	},
});

extend(Stats, {
	getBaseStatsMultiplier: function () {
		return extend(extend(extend({}, baseStatsMultiplier), baseStatsIncrease), baseResists);
	},

	useValkkyFormulas: function() {
		extend(Stats.prototype, {

			formulas: "valkky",

			getSkillDamage: function (fPotency) {
				// http://valk.dancing-mad.com/methodology/#FinalFormulas
				return (fPotency/100)*(
					((0.0032*this.strength+0.4162)*this.weaponDamage)
					+(0.1*this.strength-0.3529)
					+((this.determination-202)*0.035)
				)*(1+(0.5*this.getSkillCriticalRate()))*this.increaseDamage;
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
		return Stats;
	},

	useCcbrownFormulas: function() {
		extend(Stats.prototype, {

			formulas: "ccbrown",

			getSkillDamage: function (fPotency) {
				// https://github.com/ccbrown/xiv-sim/blob/master/src/models/Monk.cpp
				return (fPotency/100) * (
					this.weaponDamage * (
						this.strength * 0.00389 + this.determination * 0.0008 + 0.01035
					) + (this.strength * 0.08034) + (this.determination * 0.02622)
				)*(1+(0.5*this.getSkillCriticalRate()))*this.increaseDamage;
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
		return Stats;
	},
});

Stats.useValkkyFormulas(); // defaults to Valkky formulas