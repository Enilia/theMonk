var assert = require("assert"),
	extend = require("util")._extend;

describe('Stats.valkky', function() {

	var Stats, stats;

	before(function() {
		Stats = require("../Modules/Stats").useValkkyFormulas();
		stats = new Stats(
			extend(Stats.getBaseStatsMultiplier(), {
				weaponDamage: 				51,
				weaponAutoAttack: 			40.8,
				weaponAutoAttackDelay: 		2.4,
				strength: 					562,
				critical: 					441,
				determination: 				367,
				skillSpeed: 				397,
			})
		);
	});

	describe('#getSkillDamage', function() {
		it("should return 185.30 for 100 potency", function() {
			assert.strictEqual(stats.getSkillDamage(100).toFixed(2), "185.30");
		});
		it("should return 211.49 for 100 potency with 30% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3}).getSkillDamage(100).toFixed(2), "211.49");
		});
		it("should return 232.64 for 100 potency with 30% crit bonus and 10% damage bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3, increaseDamage: 1.1}).getSkillDamage(100).toFixed(2), "232.64");
		});
		it("should return 203.83 for 100 potency with 10% damage bonus", function() {
			assert.strictEqual(stats.buff({increaseDamage: 1.1}).getSkillDamage(100).toFixed(2), "203.83");
		});
		it("should return 261.85 for 100 potency with 100% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 1}).getSkillDamage(100).toFixed(2), "261.85");
			assert.strictEqual(stats.buff({criticalHitChance: 2}).getSkillDamage(100).toFixed(2), "261.85");
		});
	});

	describe('#getAutoAttackDamage', function() {
		it("should return 158.75", function() {
			assert.strictEqual(stats.getAutoAttackDamage().toFixed(2), "158.75");
		});
	});
});