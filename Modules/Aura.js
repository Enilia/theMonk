var extend = require("util")._extend,
	inherits = require("util").inherits;

exports = module.exports = Aura;
exports.createAura = createAura;

function Aura(conf) {
	if(false === this.onApply(conf && conf.owner)) {
		return false;
	}
	this.refresh(conf);
}

extend(Aura.prototype, {
	name: "name", 
	duration: 0,
	expireTime: 0, 
	owner: null, 
	count: 0,
	maximumCount: 1,
	potency: 0,
	tickDamage: 0,
	tickCriticalRate: 0,

	increaseDamage: 1,
	increasedAutoAttackSpeed: 0,
	reducedGlobalCooldown: 0,
	additionalCriticalHitChance: 0,
	additionalSkillCriticalHitChance: 0,
	transformIncomingDamage: 1,

	statsMultiplier: {
	},

	refresh: function(conf) {
		conf = conf || {};
		if(this.potency) {
			this.tickDamage = conf.stats.getSkillDamage(this.potency);
			this.tickCriticalRate = conf.stats.getCriticalRate();
		}

		this.expireTime = (conf.time || 0) + this.duration;
		this.owner = conf.owner;
		this.count = Math.min(this.count + 1, this.maximumCount);
	},

	onApply: function(source, time) {

	},
});

function createAura(properties, specialProperties) {
	function F(){ Aura.apply(this, arguments) };
	inherits(F, Aura);
	extend(F.prototype, properties);
	Object.defineProperties(F.prototype, specialProperties || {});
	return F;
}

// partyBonus = createAura({
// 	name: "Party Bonus",
// 	duration: Number.MAX_VALUE,
// 	statsMultiplier: {
// 		strength: 1.03
// 	}
// });

// greasedLigthning = createAura({
// 	name: "Greased Ligthning", 
// 	duration: 12, 
// 	maximumCount: 3,
// }, {
// 	increaseDamage: {
// 		get: function() {
// 			return this.count * 0.09 + 1;
// 		}, 
// 	}, 
// 	increasedAutoAttackSpeed: {
// 		get: function() {
// 			return this.count * 0.05;
// 		}, 
// 	}, 
// 	reducedGlobalCooldown: {
// 		get: function() {
// 			return this.count * 0.05;
// 		}, 
// 	}, 
// });