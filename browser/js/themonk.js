require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../lib/Aura":5,"../lib/Skill":11,"util":18}],2:[function(require,module,exports){
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
},{"../lib/Aura":5,"../lib/Skill":11,"util":18}],3:[function(require,module,exports){
var libSkill = require('../lib/Skill'),
	Skill = libSkill.createSkill,
	Combo = libSkill.createCombo,
	Aura = require('../lib/Aura').createAura,
	extend = require("util")._extend,
	damageTypes = libSkill.damageTypes;

exports = module.exports = Ninja;

function Ninja() {
	var skills = this.skills;

	this.skills = {};

	for(var i in skills) this.skills[i] = new skills[i];
}

extend(Ninja.prototype, {

	damageType: damageTypes.SLASH,
	
	prepareForBattle: function(time, source) {
		source.applyAuraImmediate(source.model.auras.KissOfTheViper, source, time);
		source.applyAuraImmediate(source.model.auras.Huton, source, time);
		source.findAura("Huton").expireTime -= 20;
	},

	skills: {

		/*
			--- Skills ---
		*/

		SpinningEdge: Skill({
			name: "SpinningEdge",
			potency: 150,
			damageType: damageTypes.SLASH,
			onUse: function(time, source, target) {
			}
		}),

		GustSlash: Combo("SpinningEdge", {
			name: "GustSlash",
			potency: 200,
			damageType: damageTypes.SLASH,
		}),

		ShadowFang: Combo("SpinningEdge", {
			name: "ShadowFang",
			potency: 200,
			damageType: damageTypes.SLASH,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.ShadowFangDOT, source, time);
			}
		}),

		AeolianEdge: Combo("GustSlash", {
			name: "AeolianEdge",
			potency: 320,
			damageType: damageTypes.SLASH,
		}),

		DancingEdge: Combo("GustSlash", {
			name: "DancingEdge",
			potency: 260,
			damageType: damageTypes.SLASH,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.DancingEdge, source, time);
			}
		}),

		/*
			--- DOTs ---
		*/

		Mutilate: Skill({
			name: "Mutilate",
			potency: 60,
			damageType: damageTypes.SLASH,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.MutilateDOT, source, time);
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

		Kassatsu: Skill({
			name: "Kassatsu",
			recast: 120,
			isOffGCD: true,
			onUse: function(time, source, target) {
				source.applyAura(source.model.auras.Kassatsu, source, time);
			}
		}),

		/*
			--- OffGCD ---
		*/

		Suiton: Skill({
			name: "Suiton",
			recast: 20,
			isOffGCD: true,
			animationLock: 1.5,
			onUse: function(time, source, target) {
				var mudra = source.applyAuraImmediate(source.model.auras.Mudra, source, time);
				mudra.mudra = "Suiton";
			}
		}),

		Huton: Skill({
			name: "Huton",
			recast: 20,
			isOffGCD: true,
			animationLock: 1.5,
			onUse: function(time, source, target) {
				var mudra = source.applyAuraImmediate(source.model.auras.Mudra, source, time);
				mudra.mudra = "Huton";
			}
		}),

		Raiton: Skill({
			name: "Raiton",
			recast: 20,
			isOffGCD: true,
			animationLock: 1,
			onUse: function(time, source, target) {
				var mudra = source.applyAuraImmediate(source.model.auras.Mudra, source, time);
				mudra.mudra = "Raiton";
			}
		}),

		Ninjutsu: Skill({
			name: "Ninjutsu",
			damageType: damageTypes.MAGIC,
			recast: 20,
			isOffGCD: true,
			stats: {},
			onUse: function(time, source, target) {
				var mudra = source.findAura("Mudra", source),
					kassatsu = source.findAura("Kassatsu", source);

				if(!mudra) return;
				source.removeAura(mudra, time);
				source.removeAura(kassatsu, time);

				switch(mudra.mudra) {
					case "Suiton":
						source.applyAura(source.model.auras.Suiton, source, time);
						break;
					case "Huton":
						source.applyAura(source.model.auras.Huton, source, time);
						break;
					case "Raiton":
						break;
				}
			},
			getPotency: function(source, target, time) {
				var aura = source.findAura("Mudra", source);

				switch(aura.mudra) {
					case "Suiton":
						return 180;
						break;
					case "Huton":
						return 0;
						break;
					case "Raiton":
						return 360;
						break;
				}
			},
		}),

		Mug: Skill({
			name: "Mug",
			potency: 140,
			damageType: damageTypes.SLASH,
			recast: 90,
			isOffGCD: true,
		}),

		SneakAttack: Skill({
			name: "SneakAttack",
			potency: 500,
			damageType: damageTypes.SLASH,
			recast: 60,
			isOffGCD: true,
		}),

		Jugulate: Skill({
			name: "Jugulate",
			potency: 80,
			damageType: damageTypes.SLASH,
			recast: 30,
			isOffGCD: true,
		}),

		TrickAttack: Skill({
			name: "TrickAttack",
			potency: 400,
			damageType: damageTypes.SLASH,
			recast: 60,
			isOffGCD: true,
			onUse: function(time, source, target) {
				target.applyAura(source.model.auras.TrickAttack, source, time);
			}
		}),
	},

	auras: {

		/*
			--- Buffs ---
		*/

		KissOfTheWasp: Aura({
			name: "KissOfTheWasp",
			duration: Infinity,
			increaseDamage: 1.2,
		}),

		KissOfTheViper: Aura({
			name: "KissOfTheViper",
			duration: Infinity,
			increaseDamage: 1.2,
		}),

		Huton: Aura({
			name: "Huton",
			duration: 70,
			increasedAutoAttackSpeed: 0.15,
			reducedGlobalCooldown: 0.15,
		}),

		Suiton: Aura({
			name: "Suiton",
			duration: 10,
		}),

		Mudra: Aura({
			name: "Mudra",
			duration: 5,
		}),

		Kassatsu: Aura({
			name: "Kassatsu",
			duration: 10,
			onApply: function(source, time) {
				var onExpire;

				source.model.skills.Ninjutsu.stats.additionalSkillCriticalHitChance = 1;
				source.model.skills.Ninjutsu.reset(time);
				source.model.skills.Suiton.reset(time);
				source.model.skills.Huton.reset(time);
				source.model.skills.Raiton.reset(time);

				source.on(source.events.auraExpire, onExpire = function(aura, isExpired, time) {
					if(aura.name === "Kassatsu") {
						source.model.skills.Ninjutsu.stats.additionalSkillCriticalHitChance = 0;
						source.removeListener(source.events.auraExpire, onExpire);
					}
				});
			}
		}),

		InternalRelease: Aura({
			name: "InternalRelease",
			duration: 15,
			additionalCriticalHitChance: 0.1,
		}),

		BloodForBlood: Aura({
			name: "BloodForBlood",
			duration: 20,
			increaseDamage: 1.1,
		}),

		/*
			--- DOTs ---
		*/

		MutilateDOT: Aura({
			name: "MutilateDOT",
			duration: 30,
			potency: 30,
		}),

		ShadowFangDOT: Aura({
			name: "ShadowFangDOT",
			duration: 18,
			potency: 40,
		}),

		/*
			--- Debuffs ---
		*/

		DancingEdge: Aura({
			name: "DancingEdge",
			duration: 20,
			slashResist: 0.9,
		}),

		TrickAttack: Aura({
			name: "TrickAttack",
			duration: 10,
			transformIncomingDamage: 1/0.9,
		}),

	}
});
},{"../lib/Aura":5,"../lib/Skill":11,"util":18}],4:[function(require,module,exports){
var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Stats = require('./Stats'),
	Rotation = require('./Rotation'),
	models = {
		Monk: require("../Models/Monk"),
		Dragoon: require("../Models/Dragoon"),
		Ninja: require("../Models/Ninja"),
	};

exports = module.exports = Actor;

function Actor(conf) {
	EventEmitter.call(this);

	this.activeAuras = [];
	this.pendingAuras = [];
	this.combo = {
		name: "",
		time: null,
	};

	this.stats = new Stats(conf.stats);
	this.rotation = new Rotation(conf.rotation || "");
	this.modelName = conf.model;
	this.name = conf.name;
	this.inactive = !!conf.inactive;

	this.rotation.on("error", this.emit.bind(this, "error"));
}

inherits(Actor, EventEmitter);

extend(Actor, {
	models: models,
});

extend(Actor.prototype, {

	name: "Actor",

	nextAction:Infinity,
	nextOffGCD:Infinity,
	nextAutoAttack:Infinity,

	inactive: false,

	events: {
		autoattack: "autoattack",	// (damage, critical, time)
		skill: "skill",				// (damage, critical, skill, time)
		auraApply: "auraApply",		// (aura, time)
		auraTick: "auraTick",		// (damage, critical, aura, time)
		auraRefresh: "auraRefresh",	// (aura, time)
		auraExpire: "auraExpire",	// (aura, isExpired, time)
	},

	activeAuras: null,
	pendingAuras: null,
	stats: null,
	model: null,
	modelName: null,
	rotation: null,
	combo: null,

	nextTimeOfInterest: function(time) {
		var next = this.pendingAuras.reduce(function(previousValue, currentValue) {
			return Math.min(previousValue, currentValue.time);
		}, Infinity);

		return Math.min(this.nextAction, this.nextAutoAttack, this.nextOffGCD, next) - time;
	},

	action: function(time, target) {

		var stats = this.getStats(),
			targetStats = target.getStats(),
			GCD, skillName;

		switch(time) {
			case this.nextAutoAttack:
				this.emit(this.events.autoattack,
					stats.getAutoAttackDamage()*targetStats.transformIncomingDamage/targetStats[this.model.damageType],
					stats.getCriticalRate(),
					time
				);

				this.nextAutoAttack = stats.getAutoAttackDelay() + time;
				break;
			case this.nextAction:
			case this.nextOffGCD:
				skillName = this.rotation.run(this, target, time);

				if(skillName && (skill = this.model.skills[skillName])) {
					GCD = stats.getGCD();

					if(skill.isOffGCD) {
						if(this.nextAction === time) {
							this.nextAction = time + GCD / 2;
							this.nextOffGCD = time + GCD;
						} else {
							// this.nextAction = time + GCD / 2;
							this.nextOffGCD = time + GCD;
						}
					} else {
						if(this.nextAction === time) {
							this.nextAction = time + GCD;
							this.nextOffGCD = time + GCD / 2;
						} else {
							// this.nextAction = time + GCD / 2;
							this.nextOffGCD = time + GCD;
							break;
						}
						this.setCombo(skill.name, time);
					}

					this.nextAction = Math.max(this.nextAction, time + skill.animationLock);
					this.nextOffGCD = Math.max(this.nextOffGCD, time + skill.animationLock);

					stats = stats.buff(skill.stats);
					this.emit(this.events.skill,
				  		skill.getPotency(this, target, time) && stats.getSkillDamage(skill.getPotency(this, target, time))*targetStats.transformIncomingDamage/targetStats[skill.damageType],
				  		stats.getSkillCriticalRate(),
				  		skill,
				  		time
				  	);
					skill._onUse(Math.min(this.nextAction, this.nextOffGCD), this, target);
				} else {
					this.emit("error", new Error(skillName + " is not a valid skill"));
				}
				break;
			default:
				this.emit("error", new Error("unoptimized action call \n"
											+ "name: " + this.name + "\n"
											+ "time: " + time));
		}
	},

	preTick: function(time) {

		this.pendingAuras.slice().forEach(function(pendingAura) {
			if(pendingAura.time === time) {
				this.applyAuraImmediate(pendingAura.aura, pendingAura.owner, pendingAura.time, pendingAura.stats, pendingAura.tstats);
				this.pendingAuras.splice(this.pendingAuras.indexOf(pendingAura), 1);
			}
		}, this);

		this.activeAuras.slice().forEach(function(aura) {
			if(aura.expireTime < time) {
				this.removeAura(aura, time, true);
			}
		}, this);
	},

	tick: function(time) {
		this.activeAuras.forEach(function(aura) {
			if(aura.tickDamage){
				this.emit(this.events.auraTick,
			  		aura.tickDamage,
			  		aura.tickCriticalRate,
			  		aura,
			  		time
			  	);
			}
		}, this);
	},

	prepareForBattle: function(time) {
		if(!(this.modelName in models))
			this.emit("error", new Error("invalid model : " + this.modelName));

		this.model = new (models[this.modelName]);
		this.rotation.prepare();

		if(this.inactive) {
			return this;
		}

		this.model.prepareForBattle(time, this);
		this.nextAction = this.nextAutoAttack = time;
		this.nextOffGCD = time + this.getStats().getGCD() / 2;

		return this;
		
	},

	setCombo: function(combo, time) {
		this.combo = {
			name: combo,
			time: time, 
		};
	},

	hasCombo: function(combo, time) {
		return (this.combo.name === combo) && (time - this.combo.time <= 10);
	},

	applyAura: function(aura, source, time) {
		this.pendingAuras.push({
			aura: aura,
			stats: source.getStats(),
			tstats: this.getStats(),
			time: time,
			owner: source,
		});
	},

	applyAuraImmediate: function(aura, source, time, stats, tstats) {
		var _aura = this.findAura(aura.prototype.name, source);

		conf = {
			stats: stats || source.getStats(),
			tstats: tstats,
			time: time,
			owner: source,
		};

		conf.stats.skillCriticalHitChance = 0; // DoTs don't benefit this

		if(_aura && _aura.onApply(source, time) !== false) {
			_aura.refresh(conf);
			this.emit(this.events.auraRefresh, _aura, time);
		} else {
			_aura = new aura(conf);
			if(_aura.onApply(source, time) !== false) {
				this.activeAuras.push(_aura);
				this.emit(this.events.auraApply, _aura, time);
			}
		}

		return _aura;
	},

	findAura: function(auraName, source) {
		var i, l, _aura;
		for(i = 0, l = this.activeAuras.length; i < l; i++) {
			_aura = this.activeAuras[i];
			if(_aura.name === auraName && _aura.owner === source) {
				return _aura;
			}
		}
		return false;
	},

	removeAura: function(aura, time, isExpired) {
		var pos = this.activeAuras.indexOf(aura);
		if(~pos) {
			this.activeAuras.splice(pos, 1);
			this.emit(this.events.auraExpire, aura, isExpired, time);
		}
	},

	getStats: function() {
		return this.activeAuras.reduce(function(stats, aura) {
			return stats.buff(extend(extend({}, aura.statsMultiplier), {
				criticalHitChance: aura.additionalCriticalHitChance,
				skillCriticalHitChance: aura.additionalSkillCriticalHitChance,
				increaseDamage: aura.increaseDamage,
				increasedAutoAttackSpeed: aura.increasedAutoAttackSpeed,
				reducedGlobalCooldown: aura.reducedGlobalCooldown,
				transformIncomingDamage: aura.transformIncomingDamage,
				BLUNT: aura.bluntResist,
				SLASH: aura.slashResist,
				PIERCING: aura.piercingResist,
				MAGIC: aura.magicResist,
			}));
		}, this.stats);
	},

	free: function() {
		this.rotation.free();
	},
});
},{"../Models/Dragoon":1,"../Models/Monk":2,"../Models/Ninja":3,"./Rotation":19,"./Stats":12,"events":14,"util":18}],5:[function(require,module,exports){
var extend = require("util")._extend,
	inherits = require("util").inherits;

exports = module.exports = Aura;
exports.createAura = createAura;

function Aura(conf) {
	this.refresh(conf);
}

extend(Aura.prototype, {
	name: "name", 
	mudra: "",
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

	bluntResist: 1,
	slashResist: 1,
	piercingResist: 1,
	magicResist: 1,

	refresh: function(conf) {
		conf = conf || {};
		if(this.potency) {
			this.tickDamage = conf.stats.getSkillDamage(this.potency)*conf.tstats.transformIncomingDamage;
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
},{"util":18}],6:[function(require,module,exports){
var inherits = require("util").inherits,
	extend = require("util")._extend,
	format = require("util").format;

exports.RotationError = RotationError;

function RotationError(error, args, source) {
	this.error = error;
	this.arguments = args;
	this.source = source;
	
	captureStackTrace(this);
}

inherits(RotationError, Error);

extend(RotationError.prototype, {
	name: "RotationError",
	arguments: null,
	source: null,
	error: null,

	getSourceErrorPosition: function() {
		var m = this.error.stack.match(/:(\d+):(\d+)/);

		return {
			line: parseInt(m[1]) - 1,
			col: parseInt(m[2])
		};
	},
});

function captureStackTrace(rotationError) {
	Object.defineProperties(rotationError, {
		"stack": {
			configurable: true,
			enumerable: true,
			get: function() {
				var pos = this.getSourceErrorPosition(),
					source = this.source.split(/\r?\n/),
					begin = Math.max(pos.line - 1 - 1, 0),
					end = Math.min(pos.line + 1 - 1, source.length - 1),
					stack = "",
					i, isFaultyLine;

				stack += format("\n[%s] at line %d, col %d\n\n", this.toString(), pos.line, pos.col);
				for(; begin <= end; begin++) {
					isFaultyLine = (begin === pos.line - 1);
					stack += format("%s%s\n", (begin + 1 + "   ").slice(0,3), source[begin].replace(/\t/g, " "));
					isFaultyLine && (stack += format("---%s^\n", Array(pos.col).join("-")));
				}

				return stack;
			}
		},
	});
}
},{"util":18}],7:[function(require,module,exports){
var inherits = require("util").inherits,
	extend = require("util")._extend,
	format = require("util").format;

exports.RotationSyntaxError = RotationSyntaxError;

function RotationSyntaxError(error, args, source) {
	this.message = error.message;
	this.error = error;
	this.arguments = args;
	this.source = source;

	captureStackTrace(this);
}

inherits(RotationSyntaxError, Error);

extend(RotationSyntaxError.prototype, {
	name: "RotationSyntaxError",
	arguments: null,
	source: null,
	error: null,
});

function captureStackTrace(rotationSyntaxError) {
	Object.defineProperties(rotationSyntaxError, {
		"stack": {
			configurable: true,
			enumerable: true,
			get: function() {
				var source = this.source.split(/\r?\n/),
					token = this.error.arguments[0],
					stack = "",
					index = 0, length = source.length,
					line, col,
					begin, end, isFaultyLine;

				stack += format("\n %s\n\n", this.toString());
				stack += "Possible error locations:\n\n";

				for(; index < length; index++) {
					line = source[index];
					if(~(col = line.indexOf(token))) {
						begin = Math.max(index - 1, 0);
						end = Math.min(index + 1, source.length - 1);

						stack += format("@%d:%d\n", index + 1, col + 1);
						for(; begin <= end; begin++) {
							isFaultyLine = (begin === index);
							stack += format("%s%s\n", (begin + 1 + "   ").slice(0,3), source[begin].replace(/\t/g, " "));
							isFaultyLine && (stack += format("   %s^\n", Array(col + 1).join(" ")));
						}
						stack += "\n";
					}
				}

				return stack;
			}
		},
	});
}
},{"util":18}],8:[function(require,module,exports){
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
},{"./Errors/RotationError":6,"./Errors/RotationSyntaxError":7,"events":14,"util":18,"vm":13}],9:[function(require,module,exports){
var extend = require("util")._extend;

exports = module.exports = Scheduled;

function Scheduled(conf) {
	conf = conf || {};
	this.maxTime = conf.maxTime || 0;
	this.time = conf.time || 0;
	this.listeners = {};
}

extend(Scheduled.prototype, {
	time: 0,
	maxTime: 0,
	listeners: null,

	next: function() {
		if(this.isEmpty()) return false;
		if(this.isExpired(this.time)) return false;

		var next, name, _next, _name;
		for(_name in this.listeners) {
			_next = this.listeners[_name];
			if(!next || _next.time < next.time) {
				next = _next;
				name = _name;
			}
		}

		delete this.listeners[name];

		this.time = next.time;
		if(this.isExpired(this.time)) return false;
		return next.fun;
	},

	register: function(name, fun, time, thisp) {
		var listener;

		if(listener = this.listeners[name]) {
			if(listener.time <= (this.time + time)) return;
		}

		this.listeners[name] = {
			fun: thisp ? fun.bind(thisp) : fun,
			time: this.time + time
		};
	},

	isEmpty: function() {
		for(var i in this.listeners) {
			return false;
		}
		return true;
	},

	isExpired: function(time) {
		return time > this.maxTime;
	},
});
},{"util":18}],10:[function(require,module,exports){
(function (process,global){
var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Scheduled = require("./Scheduled2"),
	Actor = require("./Actor"),
	setImmediate = global.setImmediate || process.nextTick;

exports = module.exports = Simulation;

function Simulation() {
	EventEmitter.call(this);

	this.scheduled = new Scheduled();
	this.target = new Actor({
		model: "Monk",
		name: "Target",
		inactive: true,
	});
	this.actors = [this.target];
}

inherits(Simulation, EventEmitter);

extend(Simulation.prototype, {

	scheduled: null,
	actors: null,
	target: null,
	stopped: false,

	run: function() {
		var scheduled = this.scheduled,
			actors = this.actors,
			target = this.target,
			next;

		this.emit("start", actors);

		scheduled.register("tick", this.tick, 3, this);
		scheduled.register("checkActors", this.checkActors, 0, this);

		actors.forEach(function(actor) {
			actor.prepareForBattle(scheduled.time);
		}, this);

		setImmediate(this.loop.bind(this));
	},

	loop: function() {
		if(this.stopped) return;
		if(next = this.scheduled.next()) {
			next();
			this.actors.forEach(function(actor) {
				this.scheduled.register("checkActors", this.checkActors, actor.nextTimeOfInterest(this.scheduled.time), this);
			}, this);
			setImmediate(this.loop.bind(this));
			this.emit("progress", this.scheduled.time, this.scheduled.maxTime);
		} else {
			setImmediate(this.end.bind(this));
		}
	},

	end: function() {
		this.free();
		this.emit("end", Math.min(this.scheduled.maxTime, this.scheduled.time));
	},

	cancel: function() {
		this.free();
		this.stopped = true;
	},

	free: function() {
		this.actors.forEach(function(actor) {
			actor.free();
		});
	},

	tick: function() {
		this.actors.forEach(function(actor) {
			actor.preTick(this.scheduled.time);
		}, this);
		this.actors.forEach(function(actor) {
			actor.tick(this.scheduled.time);
		}, this);
		this.scheduled.register("tick", this.tick, 3, this);
	},

	checkActors: function() {
		this.actors.forEach(function(actor) {
			actor.preTick(this.scheduled.time);
		}, this);
		
		this.actors.forEach(function(actor) {
			if(this.stopped) return;
			if(actor.nextTimeOfInterest(this.scheduled.time) <= 0) {
				actor.action(this.scheduled.time, this.target);
			}
		}, this);
	},

})
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Actor":4,"./Scheduled2":9,"_process":16,"events":14,"util":18}],11:[function(require,module,exports){
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
},{"util":18}],12:[function(require,module,exports){
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
			if(stat in baseResists && multiplier[stat] !== 1)
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
},{"util":18}],13:[function(require,module,exports){
// https://github.com/substack/vm-browserify
var indexOf = function(arr, obj) {
    return arr.indexOf(obj);
};

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
    
    var iframe = this.iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = this.win = iframe.contentWindow;
    var wEval = this.wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        this.wEval = win.eval;
    }
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var win = this.win;
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = this.wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

Script.prototype.free = function () {
    this.iframe && document.body.removeChild(this.iframe);
    this.code = this.iframe = this.win = this.wEval = null;
};

forEach(["runInContext","runInThisContext","runInNewContext"], function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],15:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],16:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],17:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],18:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":17,"_process":16,"inherits":15}],19:[function(require,module,exports){
var Rotation = require("../../Rotation"),
	extend = require("util")._extend;

exports = module.exports = Rotation;

extend(Rotation.prototype, {
	free: function() {
		this.script.free();
	},
})
},{"../../Rotation":8,"util":18}],"themonk":[function(require,module,exports){
(function (process,global){
var util = require("util"),
	format = util.format,
	extend = util._extend,
	inherits = util.inherits,
	EventEmitter = require("events").EventEmitter,
	Actor = require('./lib/Actor'),
	Simulation = require("./lib/Simulation"),
	Stats = require("./lib/Stats"),
	setImmediate = global.setImmediate || process.nextTick;

exports = module.exports = theMonk;

function theMonk() {
	EventEmitter.call(this);

	this.simulation = new Simulation();
	this.simulation.on("start", this.emit.bind(this, "start"));
	this.simulation.on("progress", this.emit.bind(this, "progress"));
	this.simulation.on("end", this.emit.bind(this, "end"));
}

inherits(theMonk, EventEmitter);

extend(theMonk, {
	models: Actor.models,
});

extend(theMonk.prototype, {

	simulation: null,

	hasActor: function(name) {
		return this.simulation.actors.some(function(actor) {
			return actor.name === name;
		});
	},

	addActor: function(model, name, stats, rotation) {
		var actors = this.simulation.actors;

		if(this.hasActor(name)) {
			this.emit("warn", format("Duplicate Actor '%s'.", name));
		}

		actors.push(new Actor({
			model: model,
			name: name,
			stats: stats,
			rotation: rotation,
		}).on("error", function(e) {
			this.cancel();
			this.emit("error", e);
		}.bind(this)));

		return this;
	},

	addActors: function(actors) {
		actors.forEach(function(actor) {
			this.addActor.apply(this, actor);
		}, this);

		return this;
	},

	setMaxTime: function(time) {
		this.simulation.scheduled.maxTime = time;
		return this;
	},

	run: function() {

		setImmediate(this.simulation.run.bind(this.simulation));

		return this;
	},

	cancel: function() {
		this.simulation.cancel();
		this.simulation.end();
		return this;
	},

	useValkkyFormulas: function() {
		Stats.useValkkyFormulas();
		return this;
	},

	useCcbrownFormulas: function() {
		Stats.useCcbrownFormulas();
		return this;
	},

});
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/Actor":4,"./lib/Simulation":10,"./lib/Stats":12,"_process":16,"events":14,"util":18}]},{},[])


//# sourceMappingURL=themonk.js.map