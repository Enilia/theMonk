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
				var mudra = target.applyAuraImmediate(source.model.auras.Mudra, source, time);
				mudra.mudra = "Suiton";
			}
		}),

		Huton: Skill({
			name: "Huton",
			recast: 20,
			isOffGCD: true,
			animationLock: 1.5,
			onUse: function(time, source, target) {
				var mudra = target.applyAuraImmediate(source.model.auras.Mudra, source, time);
				mudra.mudra = "Huton";
			}
		}),

		Raiton: Skill({
			name: "Raiton",
			recast: 20,
			isOffGCD: true,
			animationLock: 1,
			onUse: function(time, source, target) {
				var mudra = target.applyAuraImmediate(source.model.auras.Mudra, source, time);
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