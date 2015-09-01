var libSkill = require('../lib/Skill'),
	Skill = libSkill.createSkill,
	Combo = libSkill.createCombo,
	Aura = require('../lib/Aura').createAura,
	extend = require("util")._extend,
	damageTypes = libSkill.damageTypes;

exports = module.exports = Dragoon;

function Dragoon() {
	var skills = this.skills;

	this.skills = {};

	for(var i in skills) this.skills[i] = new skills[i];
}

extend(Dragoon.prototype, {

	name: "Dragoon",

	damageType: damageTypes.PIERCING,
	
	prepareForBattle: function(time, source) {
	},

	skills: {

		/*
			--- Skills ---
		*/

		HeavyThrust: Skill({
			name: "HeavyThrust",
			potency: 170,
			damageType: damageTypes.PIERCING,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.HeavyThrust, source, time);
			}
		}),

		TrueThrust: Skill({
			name: "TrueThrust",
			potency: 150,
			damageType: damageTypes.PIERCING,
		}),

		VorpalThrust: Combo("TrueThrust", {
			name: "VorpalThrust",
			potency: 200,
			damageType: damageTypes.PIERCING,
		}),

		FullThrust: Combo("VorpalThrust", {
			name: "FullThrust",
			potency: 330,
			damageType: damageTypes.PIERCING,
		}),

		ImpulseDrive: Skill({
			name: "ImpulseDrive",
			potency: 180,
			damageType: damageTypes.PIERCING,
		}),

		Disembowel: Combo("ImpulseDrive", {
			name: "Disembowel",
			potency: 220,
			damageType: damageTypes.PIERCING,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.Disembowel, source, time);
			}
		}),

		/*
			--- DOTs ---
		*/

		ChaosThrust: Combo("Disembowel", {
			name: "ChaosThrust",
			potency: 200,
			damageType: damageTypes.PIERCING,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.ChaosThrustDOT, source, time);
			}
		}),

		Phlebotomize: Skill({
			name: "Phlebotomize",
			potency: 170,
			damageType: damageTypes.PIERCING,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.PhlebotomizeDOT, source, time);
			}
		}),

		Fracture: Skill({
			name: "Fracture",
			potency: 100,
			damageType: damageTypes.PIERCING,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.FractureDOT, source, time);
			}
		}),

		/*
			--- Buffs ---
		*/

		InternalRelease: Skill({
			name: "InternalRelease",
			recast: 60,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.InternalRelease, source, time);
			}
		}),

		BloodForBlood: Skill({
			name: "BloodForBlood",
			recast: 80,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.BloodForBlood, source, time);
			}
		}),

		LifeSurge: Skill({
			name: "LifeSurge",
			recast: 90,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.LifeSurge, source, time);
			}
		}),

		PowerSurge: Skill({
			name: "PowerSurge",
			recast: 60,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.PowerSurge, source, time);
			}
		}),

		/*
			--- OffGCD ---
		*/

		LegSweep: Skill({
			name: "LegSweep",
			potency: 130,
			damageType: damageTypes.PIERCING,
			recast: 20,
			isOffGCD: true,
		}),

		Jump: Skill({
			name: "Jump",
			potency: 200,
			damageType: damageTypes.PIERCING,
			recast: 40,
			isOffGCD: true,
			getPotency: function(source, target, time) {
				var aura;
				if(aura = source.findAura("PowerSurge", source)) {
					source.removeAura(aura, time);
					return this.potency * 1.5;
				}
				else {
					return this.potency;
				}
			},
		}),

		SpineshatterDive: Skill({
			name: "SpineshatterDive",
			potency: 170,
			damageType: damageTypes.PIERCING,
			recast: 90,
			isOffGCD: true,
			getPotency: function(source, target, time) {
				var aura;
				if(aura = source.findAura("PowerSurge", source)) {
					source.removeAura(aura, time);
					return this.potency * 1.5;
				}
				else {
					return this.potency;
				}
			},
		}),

		DragonfireDive: Skill({
			name: "DragonfireDive",
			potency: 250,
			damageType: damageTypes.PIERCING,
			recast: 180,
			isOffGCD: true,
		}),

	},

	auras: {

		/*
			--- Buffs ---
		*/

		HeavyThrust: Aura({
			name: "HeavyThrust",
			duration: 20,
			increaseDamage: 1.15,
		}),

		InternalRelease: Aura({
			name: "InternalRelease",
			duration: 15,
			additionalCriticalHitChance: 0.1,
		}),

		BloodForBlood: Aura({
			name: "BloodForBlood",
			duration: 20,
			increaseDamage: 1.3,
		}),

		LifeSurge: Aura({
			name: "LifeSurge",
			duration: 10,
			additionalSkillCriticalHitChance: 1,
			onApply: function(source, time) {
				var onSkill, onExpire;
				source.on(source.events.skill, onSkill = function(damage, critical, skill, time) {
					if(skill.potency) {
						source.removeListener(source.events.skill, onSkill);
						source.removeListener(source.events.auraExpire, onExpire);
						source.removeAura(source.findAura("LifeSurge", source), time);
					}
				});
				source.on(source.events.auraExpire, onExpire = function(aura, isExpired, time) {
					if(aura.name === "LifeSurge") {
						source.removeListener(source.events.skill, onSkill);
						source.removeListener(source.events.auraExpire, onExpire);
					}
				});
			}
		}),

		PowerSurge: Aura({
			name: "PowerSurge",
			duration: 10,
		}),

		/*
			--- DOTs ---
		*/

		ChaosThrustDOT: Aura({
			name: "ChaosThrustDOT",
			duration: 30,
			potency: 30,
		}),

		PhlebotomizeDOT: Aura({
			name: "PhlebotomizeDOT",
			duration: 18,
			potency: 25,
		}),

		FractureDOT: Aura({
			name: "FractureDOT",
			duration: 18,
			potency: 20,
		}),

		/*
			--- Debuffs ---
		*/

		Disembowel: Aura({
			name: "Disembowel",
			duration: 30,
			piercingResist: 0.9,
		}),
	}
});