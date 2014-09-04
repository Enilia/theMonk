var Skill = require("../Modules/Skill.js"),
	createSkill = Skill.createSkill,
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

});