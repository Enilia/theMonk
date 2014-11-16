var libSkill = require('../lib/Skill'),
	Skill = libSkill.createSkill,
	Aura = require('../lib/Aura').createAura,
	extend = require("util")._extend,
	damageTypes = libSkill.damageTypes;

exports = module.exports = Monk;

function Monk() {
	var skills = this.skills;

	this.skills = {};

	for(var i in skills) this.skills[i] = new skills[i];
}

extend(Monk.prototype, {

	damageType: damageTypes.BLUNT,
	
	prepareForBattle: function(time, source) {
		// source.applyAura(source.model.auras.PartyBonus, source, time);
		source.applyAuraImmediate(source.model.auras.FistOfFire, source, time);
		// source.applyAura(source.model.auras.GreasedLigthning, source, time);
		// source.applyAura(source.model.auras.GreasedLigthning, source, time);
		// source.applyAura(source.model.auras.GreasedLigthning, source, time);
		// source.applyAura(source.model.auras.OpoOpoForm, source, time);
	},

	skills: {

		/*
			--- Skills ---
		*/

		Bootshine: Skill({
			name: "Bootshine",
			potency: 150,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.RaptorForm, source, time);
			}
		}),

		BootshineRear: Skill({
			name: "BootshineRear",
			potency: 150,
			damageType: damageTypes.BLUNT,
			stats: {
				criticalHitChance:10
			},
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.RaptorForm, source, time);
			}
		}),

		TrueStrike: Skill({
			name: "TrueStrike",
			potency: 150,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.CoeurlForm, source, time);
			}
		}),

		TrueStrikeRear: Skill({
			name: "TrueStrikeRear",
			potency: 190,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.CoeurlForm, source, time);
			}
		}),

		SnapPunch: Skill({
			name: "SnapPunch",
			potency: 140,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.OpoOpoForm, source, time);
				source.applyAura(source.model.auras.GreasedLigthning, source, time);
			}
		}),

		SnapPunchFlank: Skill({
			name: "SnapPunchFlank",
			potency: 180,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.OpoOpoForm, source, time);
				source.applyAura(source.model.auras.GreasedLigthning, source, time);
			}
		}),

		TwinSnakes: Skill({
			name: "TwinSnakes",
			potency: 100,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.CoeurlForm, source, time);
				source.applyAura(source.model.auras.TwinSnakes, source, time);
			}
		}),

		TwinSnakesFlank: Skill({
			name: "TwinSnakesFlank",
			potency: 140,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.CoeurlForm, source, time);
				source.applyAura(source.model.auras.TwinSnakes, source, time);
			}
		}),

		DragonKick: Skill({
			name: "DragonKick",
			potency: 100,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.RaptorForm, source, time);
			}
		}),

		DragonKickFlank: Skill({
			name: "DragonKickFlank",
			potency: 150,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.RaptorForm, source, time);
				target.applyAura(source.model.auras.DragonKick, source, time);
			}
		}),

		ImpulseDrive: Skill({
			name: "ImpulseDrive",
			potency: 100,
			damageType: damageTypes.BLUNT,
		}),

		ImpulseDriveRear: Skill({
			name: "ImpulseDriveRear",
			potency: 180,
			damageType: damageTypes.BLUNT,
		}),

		/*
			--- DOTs ---
		*/

		Demolish: Skill({
			name: "Demolish",
			potency: 30,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.OpoOpoForm, source, time);
				source.applyAura(source.model.auras.GreasedLigthning, source, time);
				target.applyAura(source.model.auras.DemolishDOT, source, time);
			}
		}),

		DemolishRear: Skill({
			name: "DemolishRear",
			potency: 70,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.OpoOpoForm, source, time);
				source.applyAura(source.model.auras.GreasedLigthning, source, time);
				target.applyAura(source.model.auras.DemolishDOT, source, time);
			}
		}),

		TouchOfDeath: Skill({
			name: "TouchOfDeath",
			potency: 20,
			damageType: damageTypes.BLUNT,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.TouchOfDeathDOT, source, time);
			}
		}),

		Fracture: Skill({
			name: "Fracture",
			potency: 100,
			damageType: damageTypes.BLUNT,
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

		FistOfFire: Skill({
			name: "FistOfFire",
			recast: 3,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.FistOfFire, source, time);
			}
		}),

		PerfectBalance: Skill({
			name: "PerfectBalance",
			recast: 180,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.PerfectBalance, source, time);
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

		/*
			--- OffGCD ---
		*/

		SteelPeak: Skill({
			name: "SteelPeak",
			potency: 150,
			damageType: damageTypes.BLUNT,
			recast: 40,
			isOffGCD: true,
		}),

		HowlingFist: Skill({
			name: "HowlingFist",
			potency: 170,
			damageType: damageTypes.BLUNT,
			recast: 60,
			isOffGCD: true,
		}),

	},

	auras: {

		/*
			--- Buffs ---
		*/

		FistOfFire: Aura({
			name: "FistOfFire",
			duration: Infinity,
			increaseDamage: 1.1,
		}),

		RaptorForm: Aura({
			name: "RaptorForm",
			duration: 10,
			onApply: function(source, time) {
				if(source.findAura("PerfectBalance", source)) {
					return false;
				}
				source.removeAura(source.findAura("CoeurlForm", source), time);
				source.removeAura(source.findAura("OpoOpoForm", source), time);
			}
		}),

		CoeurlForm: Aura({
			name: "CoeurlForm",
			duration: 10,
			onApply: function(source, time) {
				if(source.findAura("PerfectBalance", source)) {
					return false;
				}
				source.removeAura(source.findAura("RaptorForm", source), time);
				source.removeAura(source.findAura("OpoOpoForm", source), time);
			}
		}),

		OpoOpoForm: Aura({
			name: "OpoOpoForm",
			duration: 10,
			onApply: function(source, time) {
				if(source.findAura("PerfectBalance", source)) {
					return false;
				}
				source.removeAura(source.findAura("RaptorForm", source), time);
				source.removeAura(source.findAura("CoeurlForm", source), time);
			}
		}),

		GreasedLigthning: Aura({
			name: "GreasedLigthning", 
			duration: 12, 
			maximumCount: 3,
		}, {
			increaseDamage: {
				get: function() {
					return this.count * 0.09 + 1;
				}, 
			}, 
			increasedAutoAttackSpeed: {
				get: function() {
					return this.count * 0.05;
				}, 
			}, 
			reducedGlobalCooldown: {
				get: function() {
					return this.count * 0.05;
				}, 
			}, 
		}),

		TwinSnakes: Aura({
			name: "TwinSnakes",
			duration: 15,
			increaseDamage: 1.1,
		}),

		InternalRelease: Aura({
			name: "InternalRelease",
			duration: 15,
			additionalCriticalHitChance: 0.3,
		}),

		PerfectBalance: Aura({
			name: "PerfectBalance",
			duration: 10,
			onApply: function(source) {
				source.removeAura(source.findAura("RaptorForm", source));
				source.removeAura(source.findAura("CoeurlForm", source));
				source.removeAura(source.findAura("OpoOpoForm", source));
			}
		}),

		BloodForBlood: Aura({
			name: "BloodForBlood",
			duration: 20,
			increaseDamage: 1.1,
		}),

		PartyBonus: Aura({
			name: "PartyBonus",
			duration: Infinity,
			statsMultiplier: {
				strength: 1.03
			}
		}),

		/*
			--- DOTs ---
		*/

		DemolishDOT: Aura({
			name: "DemolishDOT",
			duration: 18,
			potency: 40,
		}),

		TouchOfDeathDOT: Aura({
			name: "TouchOfDeathDOT",
			duration: 30,
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

		DragonKick: Aura({
			name: "DragonKick",
			duration: 15,
			bluntResist: 0.9,
		}),
	}
});