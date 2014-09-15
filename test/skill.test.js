var Skill = require("../Modules/Skill.js"),
	Actor = require("../Modules/Actor.js"),
	createSkill = Skill.createSkill,
	createCombo = Skill.createCombo,
	assert = require("assert"),
	util = require("util");


describe('Skill', function() {

	describe(".createSkill", function() {

		var Bootshine = new (createSkill({
				name: "Bootshine",
				potency: 150,
				onUse: function(time, source, target) {
					called = true;
				}
			})),
			BootshineRear = new (createSkill({
				name: "BootshineRear",
				potency: 150,
				stats: {
					criticalHitChance:1
				},
				onUse: function(time, source, target) {
					called = true;
				}
			})),
			HowlingFist = new (createSkill({
				name: "HowlingFist",
				potency: 170,
				recast: 60,
				isOffGCD: true,
				onUse: function(time, source, target) {
					called = true;
				}
			})),
			called = false,
			time = 0;

		beforeEach(function() {
			called = false;
			time = 0;
		});

		it("should create a Skill constructor", function() {
			assert.strictEqual(Skill.prototype.isPrototypeOf(Bootshine), true);
		});

		describe("#_onUse", function() {

			beforeEach(function() {
				HowlingFist._onUse(time);
			});

			it("should trigger #onUse", function() {
				assert(called);
			});

			it("should make skill unavailable", function() {
				assert.strictEqual(HowlingFist.isAvailable(time), false);
			});
		});

		describe("#isAvailable", function() {
			it("should return false if the skill is recharging", function() {
				HowlingFist._onUse(time);
				assert.strictEqual(HowlingFist.isAvailable(time), false);
			});
		});

	});

	describe(".createCombo", function() {

		var TrueThrust = new (createSkill({
				name: "TrueThrust",
				potency: 150,
			})),
			VorpalThrust = new (createCombo("TrueThrust", {
				name: "VorpalThrust",
				potency: 200,
			})),
			actor, time;

		beforeEach(function() {
			actor = new Actor({
				model: "Dragoon",
				name: "Dragoon",
				stats: {
					weaponDamage: 				51,
					weaponAutoAttack: 			40.8,
					weaponAutoAttackDelay: 		2.4,
					strength: 					562,
					critical: 					441,
					determination: 				367,
					skillSpeed: 				397,
				},
			});
			time = 0;
		});

		describe("#isAvailable", function() {
			it("should return false if the combo isn't ready", function() {
				assert.strictEqual(VorpalThrust.isAvailable(time, actor), false);
			});
			it("should return false if the combo is too late", function() {
				actor.setCombo("TrueThrust", time);
				assert.strictEqual(VorpalThrust.isAvailable(time+11, actor), false);
			});
			it("should return true if the combo is ready", function() {
				actor.setCombo("TrueThrust", time);
				assert.strictEqual(VorpalThrust.isAvailable(time+10, actor), true);
			});
		});

	});

});