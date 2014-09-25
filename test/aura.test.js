var Aura = require("../Modules/Aura.js"),
	Actor = require("../Modules/Actor.js"),
	createAura = Aura.createAura,
	Stats = require("../Modules/Stats.js"),
	assert = require("assert"),
	util = require("util"),
	path = require("path"),
	fs = require("fs");


describe('Aura', function() {

	describe(".createAura", function() {

		var partyBonus = createAura({
			name: "Party Bonus",
			duration: Infinity,
			statsMultiplier: {
				strength: 1.03
			}
		});

		var greasedLigthning = createAura({
			name: "Greased Ligthning", 
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
		});

		var Demolish = createAura({
			name: "Demolish",
			duration: 18,
			potency: 40,
		});

		var stats = new Stats({
			weaponDamage: 				51,
			weaponAutoAttack: 			40.8,
			weaponAutoAttackDelay: 		2.4,
			strength: 					562,
			critical: 					441,
			determination: 				367,
			skillSpeed: 				397,
		}),

		time = 10;

		describe("new .createAura", function() {
			it("should create an Aura constructor", function() {
				assert(new partyBonus instanceof Aura);
			});

			it("should setup the aura with the provided configuration object", function() {
				var pb = new partyBonus({
						time: time,
					}),
					gl = new greasedLigthning({
						time: time,
					}),
					dml = new Demolish({
						stats: stats,
						time: time,
					});

				assert.strictEqual(pb.expireTime, Infinity);
				assert.strictEqual(gl.expireTime, time+gl.duration);
				assert.strictEqual(dml.tickDamage.toFixed(2), "74.12");
				assert.strictEqual(dml.tickCriticalRate.toFixed(2), "0.12");
				assert.strictEqual(gl.count, 1);
			});
		});

		describe("#refresh", function() {
			it("should refresh the aura with the provided configuration object", function() {
				var gl = new greasedLigthning({
						time: time,
					});

				time = 20;

				gl.refresh({
					time:time
				});

				assert.strictEqual(gl.expireTime, time+12);
				assert.strictEqual(gl.count, 2);

				gl.refresh({
					time:time
				});
				assert.strictEqual(gl.count, 3);
				
				gl.refresh({
					time:time
				});
				assert.strictEqual(gl.count, 3);
			});
		});

		describe("#onApply", function() {

			var actor = new Actor({
				model: "Monk",
				name: "Monk",
				inactive: true,
			}).prepareForBattle(0);

			it("should execute when the aura is applied on the actor", function() {

				actor.applyAuraImmediate(actor.model.auras.RaptorForm, actor, 0);

				assert.strictEqual(actor.activeAuras.length, 1);
				assert.strictEqual(actor.findAura("RaptorForm", actor), actor.activeAuras[0]);

				actor.applyAuraImmediate(actor.model.auras.CoeurlForm, actor, 0);

				assert.strictEqual(actor.activeAuras.length, 1);
				assert.strictEqual(actor.findAura("CoeurlForm", actor), actor.activeAuras[0]);

			});
		});

	});

});