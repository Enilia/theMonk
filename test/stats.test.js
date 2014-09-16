var Stats = require("../Modules/Stats"),
	assert = require("assert"),
	util = require("util"),
	extend = util._extend;

describe('Stats', function() {
	var stats = new Stats(
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

	// before(function() {
	// 	console.log("");
	// 	console.log("\t" + stats.weaponAutoAttack		+ "\t = weaponDamage");
	// 	console.log("\t" + stats.weaponDamage			+ "\t = weaponAutoAttack");
	// 	console.log("\t" + stats.skillSpeed				+ "\t = weaponAutoAttackDelay");
	// 	console.log("\t" + stats.weaponAutoAttackDelay	+ "\t = strength");
	// 	console.log("\t" + stats.strength				+ "\t = critical");
	// 	console.log("\t" + stats.critical				+ "\t = determination");
	// 	console.log("\t" + stats.determination			+ "\t = skillSpeed");
	// 	console.log("");
	// });

	describe('#buff', function() {
		it("should return a new Object", function() {
			assert.notStrictEqual(stats, stats.buff());
		});
		it("should have the same base stats", function() {
			assert.deepEqual(stats, stats.buff(), "\n" + util.format("%j", stats) + "\n" + util.format("%j", stats.buff()));
		});
		it("should buff values with the provided multiplier", function() {
			var buff = stats.buff({
				strength:1.1,
				determination:1.1
			})
			assert.strictEqual(stats.strength*1.1, buff.strength);
			assert.strictEqual(stats.determination*1.1, buff.determination);
		})
	});

	describe('#getCriticalRate', function() {
		it("should return 0.12", function() {
			assert.strictEqual(stats.getCriticalRate().toFixed(2), "0.12");
		});
		it("should return 0.42 with 30% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3}).getCriticalRate().toFixed(2), "0.42");
		});
		it("should not exceed 1", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 1}).getCriticalRate().toFixed(2), "1.00");
		});
	});

	describe('#getSkillCriticalRate', function() {
		it("should return 0.12", function() {
			assert.strictEqual(stats.getSkillCriticalRate().toFixed(2), "0.12");
		});
		it("should return 0.42 with 30% crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3}).getSkillCriticalRate().toFixed(2), "0.42");
		});
		it("should return 0.52 with 30% crit bonus and 10% skill crit bonus", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 0.3, skillCriticalHitChance: 0.1}).getSkillCriticalRate().toFixed(2), "0.52");
		});
		it("should not exceed 1", function() {
			assert.strictEqual(stats.buff({criticalHitChance: 1}).getSkillCriticalRate().toFixed(2), "1.00");
		});
	});

	describe('#getGCD', function() {
		it("should return 2.44", function() {
			assert.strictEqual(stats.getGCD().toFixed(2), "2.44");
		});

		it("should return 2.07 with 0.15 speed bonus", function() {
			assert.strictEqual(stats.buff({reducedGlobalCooldown: 0.15}).getGCD().toFixed(2), "2.07");
		});
	});

	describe('#getAutoAttackDelay', function() {
		it("should return 2.40", function() {
			assert.strictEqual(stats.getAutoAttackDelay().toFixed(2), "2.40");
		});

		it("should return 2.04 with 0.15 speed bonus", function() {
			assert.strictEqual(stats.buff({increasedAutoAttackSpeed: 0.15}).getAutoAttackDelay().toFixed(2), "2.04");
		});
	});

	describe('.useValkkyFormulas', function() {

		before(function() {
			Stats.useValkkyFormulas();
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

	describe('.useCcbrownFormulas', function() {

		before(function() {
			Stats.useCcbrownFormulas();
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
});