var extend = require("util")._extend,
	inherits = require("util").inherits;

exports = module.exports = Skill;
exports.createSkill = createSkill;

function Skill() {

}

extend(Skill.prototype, {

	name: "Skill", 

	potency: 0,
	recast: 0,
	isOffGCD: false,
	nextAvailable: 0,

	stats: {},

	_onUse: function(time, source, target) {
		this.onUse(time, source, target);
		if(this.isOffGCD) {
			this.nextAvailable = time + this.recast;
		}
	},

	onUse: function(time, source, target) {

	},

	isAvailable: function(time) {
		return this.nextAvailable <= time;
	},

});

function createSkill(properties, specialProperties) {
	function F(){ Skill.apply(this, arguments) };
	inherits(F, Skill);
	extend(F.prototype, properties);
	Object.defineProperties(F.prototype, specialProperties || {});
	return F;
}

// Bootshine = createSkill({
// 	name: "Bootshine",
// 	potency: 150,
// });

// BootshineRear = createSkill({
// 	name: "BootshineRear",
// 	potency: 150,
// 	stats: {
// 		criticalHitChance:1
// 	}
// })