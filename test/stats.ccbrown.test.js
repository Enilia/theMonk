var assert = require("assert"),
	extend = require("util")._extend;

describe('Stats.ccbrown', function() {

	var Stats, stats;

	before(function() {
		Stats = require("../Modules/Stats").useCcbrownFormulas();
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
		it("should return 192.95 for 100 potency", function() {
			assert.strictEqual(stats.getSkillDamage(100).toFixed(2), "192.95");
		});
		it("should return 220.22 for 100 potency with 30% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3}).getSkillDamage(100).toFixed(2), "220.22");
		});
		it("should return 242.24 for 100 potency with 30% crit bonus and 10% damage bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3, increaseDamage: 1.1}).getSkillDamage(100).toFixed(2), "242.24");
		});
		it("should return 212.24 for 100 potency with 10% damage bonus", function() {
			assert.strictEqual(stats.buff({increaseDamage: 1.1}).getSkillDamage(100).toFixed(2), "212.24");
		});
		it("should return 272.66 for 100 potency with 100% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 1}).getSkillDamage(100).toFixed(2), "272.66");
			assert.strictEqual(stats.buff({criticalHitChance: 2}).getSkillDamage(100).toFixed(2), "272.66");
		});
	});

	describe('#getAutoAttackDamage', function() {
		it("should return 163.79", function() {
			assert.strictEqual(stats.getAutoAttackDamage().toFixed(2), "163.79");
		});
	});
});