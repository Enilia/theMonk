var extend = require("util")._extend,
	inherits = require("util").inherits,
	damageTypes = {};

exports = module.exports = Skill;
exports.createSkill = createSkill;
exports.createCombo = createCombo;
exports.damageTypes = damageTypes;

extend(damageTypes, {
	BLUNT: 		"BLUNT",
	SLASH: 		"SLASH",
	PIERCING: 	"PIERCING",
	MAGIC: 		"MAGIC",
});

function Skill() {

}

extend(Skill.prototype, {

	name: "Skill", 

	potency: 0,
	damageType: "",
	recast: 0,
	isOffGCD: false,
	nextAvailable: 0,
	combo: "",
	animationLock: 0,

	stats: {},

	getPotency: function(source, target, time) {
		return this.potency;
	},

	_onUse: function(time, source, target) {
		this.onUse(time, source, target);
		if(this.isOffGCD) {
			this.nextAvailable = time + this.recast;
		}
	},

	onUse: function(time, source, target) {

	},

	isAvailable: function(time, source) {
		return this.nextAvailable <= time;
	},

	cooldownRemaining: function(time) {
		return Math.max(this.nextAvailable - time, 0);
	},

	reset: function(time) {
		this.nextAvailable = time;
	},

});

function createSkill(properties, specialProperties) {
	function F(){ Skill.apply(this, arguments) };
	inherits(F, Skill);
	extend(F.prototype, properties);
	Object.defineProperties(F.prototype, specialProperties || {});
	return F;
}

function createCombo(skill, properties, specialProperties) {
	properties.combo = skill;

	properties.isAvailable = function(time, source) {
		return source.hasCombo(this.combo, time);
	};

	return createSkill(properties, specialProperties);
}