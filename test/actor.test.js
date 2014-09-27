var Actor = require("../lib/Actor"),
	assert = require("assert"),
	path = require("path"),
	fs = require("fs");


describe("Actor", function() {

	var actorConf = {
			model: "Monk",
			name: "Monk",
			stats: {
				weaponDamage: 				51,
				weaponAutoAttack: 			40.8,
				weaponAutoAttackDelay: 		2.4,
				strength: 					562,
				critical: 					441,
				determination: 				367,
				skillSpeed: 				397,
			},
			rotation: fs.readFileSync(
					path.resolve(
						__dirname
						, "rotations/monk.actor.test.rotation.js"
					), "utf8"
				),
		},
		actor,
		time;

	beforeEach(function() {
		actor = new Actor(actorConf);
		time = 10;

		actor.prepareForBattle(time);
		actor.activeAuras.splice(0, actor.activeAuras.length);
		actor.pendingAuras.splice(0, actor.pendingAuras.length);
	});

	describe("#nextTimeOfInterest", function() {

		beforeEach(function() {
			actor.nextAction = actor.nextOffGCD = actor.nextAutoAttack = time;
		});

		describe("should return the time before the next time of interest", function() {

			it("when time of interest is autoattacking", function() {
				actor.nextAction = actor.nextOffGCD = Infinity;
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("when time of interest is onGCD", function() {
				actor.nextAutoAttack = actor.nextOffGCD = Infinity;
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("when time of interest is offGCD", function() {
				actor.nextAutoAttack = actor.nextAction = Infinity;
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("when time of interest is pending auras", function() {
				actor.applyAura(actor.model.auras.FistOfFire, actor, time);
				actor.nextAutoAttack = actor.nextAction = actor.nextAutoAttack = Infinity;
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("when time of interest is now", function() {
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("when time of interest is in the past", function() {
				assert.strictEqual(actor.nextTimeOfInterest(time - 3), 3);
			});

			it("when time of interest is in the future", function() {
				assert.strictEqual(actor.nextTimeOfInterest(time + 3), -3);
			});

		});

	});

	describe("#action", function() {

		var targetConf = {
				model: "Monk",
				name: "Target",
				inactive: true,
			},
			target, registered, SteelPeak, Demolish, GCD,
			eventDamage, eventCritical, eventSkill, eventTime;

		before(function() {
			GCD = actor.getStats().getGCD();
		});

		beforeEach(function() {
			eventDamage = null;
			eventCritical = null;
			eventSkill = null;
			eventTime = null;
			registered = false;
			target = new Actor(targetConf);
			SteelPeak = actor.model.skills.SteelPeak;
			Demolish = actor.model.skills.Demolish;
		});

		it("throws if not auto attacking nor using skills", function() {
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
			Demolish.nextAvailable = Infinity; // bypassing Demolish
			assert.throws(function() {
				actor.action(Infinity, target);
			});
		});

		describe("when auto attacking", function() {

			beforeEach(function() {
				actor.nextAction = Infinity; // bypassing action
				actor.nextOffGCD = Infinity; // bypassing OffGCD
				actor.on(actor.events.autoattack, function(damage, critical, _time) {
					eventDamage = damage;
					eventCritical = critical;
					eventTime = _time;
					registered = true;
				});
				actor.action(time, target); // Auto Attack
			});

			it("should emit an autoattack event", function() {
				assert(registered);
			});

			it("should pass damage value to event callback", function() {
				assert.strictEqual(eventDamage.toFixed(2), "158.75");
			});

			it("should pass critical value to event callback", function() {
				assert.strictEqual(eventCritical.toFixed(2), "0.12");
			});

			it("should pass time value to event callback", function() {
				assert.strictEqual(eventTime, time);
			});

			it("should update actor.nextAutoAttack", function() {
				assert.strictEqual(actor.nextAutoAttack, actor.getStats().getAutoAttackDelay() + time);
			});
		});
		
		describe("when using skills", function() {

			beforeEach(function() {
				actor.nextAutoAttack = Infinity; // bypassing auto attack
				actor.on(actor.events.skill, function(damage, critical, skill, _time) {
					eventDamage = damage;
					eventCritical = critical;
					eventSkill = skill;
					eventTime = _time;
					registered = true;
				});
			});

			it("should register skill effects in actor.pendingAuras", function() {
				SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
				actor.action(time, target); // Demolish (onGCD)
				assert.strictEqual(actor.pendingAuras.length, 2); // [OpoOpoForm, GreasedLigthning]
			});
			it("should register skill effects in target.pendingAuras", function() {
				SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
				actor.action(time, target); // Demolish (onGCD)
				assert.strictEqual(target.pendingAuras.length, 1); // [DemolishDOT]
			});
			it("should emit a skill event", function() {
				actor.action(time, target);
				assert(registered);
			});
			it("should pass damage value to event callback", function() {
				actor.action(time, target);
				assert.strictEqual(eventDamage.toFixed(2), "277.95");
			});
			it("should pass critical value to event callback", function() {
				actor.action(time, target);
				assert.strictEqual(eventCritical.toFixed(2), "0.12");
			});
			it("should pass skill used to event callback", function() {
				actor.action(time, target);
				assert.strictEqual(eventSkill.name, "SteelPeak");
			});
			it("should pass time value to event callback", function() {
				actor.action(time, target);
				assert.strictEqual(eventTime, time);
			});
			it("should throw if the rotation returns an invalid skill name", function() {
				SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
				Demolish.nextAvailable = Infinity; // bypassing Demolish
				assert.throws(function() {
					actor.action(time, target);
				});
			});

			describe("on GCD", function() {

				describe("with on GCD skill", function() {

					beforeEach(function() {
						SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
						actor.action(time, target);
					});

					it("should emit a skill event", function() {
						assert(registered);
					});
					it("should register the skill as combo", function() {
						assert.strictEqual(actor.combo.name, eventSkill.name);
					});
					it("should update actor.nextAction", function() {
						assert.strictEqual(actor.nextAction,  time + GCD);
					});
					it("should update actor.nextOffGCD", function() {
						assert.strictEqual(actor.nextOffGCD,  time + GCD / 2);
					});
				});

				describe("with off GCD skill", function() {

					beforeEach(function() {
						Demolish.nextAvailable = Infinity; // bypassing SteelPeak
						actor.action(time, target);
					});

					it("should emit a skill event", function() {
						assert(registered);
					});
					it("should not register the skill as combo", function() {
						assert.strictEqual(actor.combo.name, "");
					});
					it("should update actor.nextAction", function() {
						assert.strictEqual(actor.nextAction, time + GCD / 2);
					});
					it("should update actor.nextOffGCD", function() {
						assert.strictEqual(actor.nextOffGCD,  time + GCD);
					});
				});
			});

			describe("off GCD", function() {

				beforeEach(function() {
					actor.nextAction = time + GCD;
					actor.nextOffGCD = time + GCD / 2;
					time = actor.nextOffGCD;
				});

				describe("with on GCD skill", function() {

					beforeEach(function() {
						SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak
						actor.action(time, target);
					});

					it("should not emit a skill event", function() {
						assert(!registered);
					});
					it("should not register the skill as combo", function() {
						assert.strictEqual(actor.combo.name, "");
					});
					it("should not update actor.nextAction", function() {
						assert.strictEqual(actor.nextAction,  time + GCD / 2);
					});
					it("should update actor.nextOffGCD", function() {
						assert.strictEqual(actor.nextOffGCD,  time + GCD);
					});
				});

				describe("with off GCD skill", function() {

					beforeEach(function() {
						Demolish.nextAvailable = Infinity; // bypassing SteelPeak
						actor.action(time, target);
					});

					it("should emit a skill event", function() {
						assert(registered);
					});
					it("should not register the skill as combo", function() {
						assert.strictEqual(actor.combo.name, "");
					});
					it("should not update actor.nextAction", function() {
						assert.strictEqual(actor.nextAction,  time + GCD / 2);
					});
					it("should update actor.nextOffGCD", function() {
						assert.strictEqual(actor.nextOffGCD,  time + GCD);
					});
				});
			});
		});
	});

	describe("#preTick", function() {
		var GreasedLigthning;

		beforeEach(function() {
			GreasedLigthning = actor.model.auras.GreasedLigthning;
		});

		it("should apply pending auras on the actor", function() {
			actor.applyAura(GreasedLigthning, actor, time);
			actor.preTick(time);
			assert.strictEqual(actor.activeAuras.length, 1);
		});

		it("should remove expired auras from the actor", function() {
			actor.applyAuraImmediate(GreasedLigthning, actor, time - GreasedLigthning.prototype.duration - 1);
			actor.preTick(time);
			assert.strictEqual(actor.activeAuras.length, 0);
		});

	});

	describe("#tick", function() {
		var eventDamage, eventCritical, eventAura, eventTime, registered;

		beforeEach(function() {
			actor.applyAuraImmediate(actor.model.auras.DemolishDOT, actor, time);
			actor.on(actor.events.auraTick, function(damage, critical, aura, _time) {
					eventDamage = damage;
					eventCritical = critical;
					eventAura = aura;
					eventTime = _time;
					registered = true;
			});
			actor.tick(time);
		});

		it("should emit an auraTick event", function() {
			assert(registered);
		});
		it("should pass damage value to event callback", function() {
			assert.strictEqual(eventDamage.toFixed(2), "74.12");
		});
		it("should pass critical value to event callback", function() {
			assert.strictEqual(eventCritical.toFixed(2), "0.12");
		});
		it("should pass ticked aura to event callback", function() {
			assert.strictEqual(eventAura.name, "DemolishDOT");
		});
		it("should pass time value to event callback", function() {
			assert.strictEqual(eventTime, time);
		});

	});
	describe("#prepareForBattle", function() {

		it("should emit an error when no model is provided", function() {

			assert.throws(function() {
				new Actor({}).prepareForBattle(time);
			},
			/invalid model/);
		});
		it("should not prepare inactive actor", function() {
			var target = new Actor({
					model: "Monk",
					name: "Target",
					inactive: true,
				});

			target.prepareForBattle(time);

			assert.strictEqual(target.nextAction, Infinity);
		});
		it("should apply auras according to model", function() {
			actor.prepareForBattle(time);

			assert.strictEqual(actor.findAura("FistOfFire", actor).name, "FistOfFire");
		});
		it("should update actor.next*", function() {
			actor.prepareForBattle(time);

			assert.strictEqual(actor.nextAction, time);
			assert.strictEqual(actor.nextAutoAttack, time);
			assert.strictEqual(actor.nextOffGCD, time + actor.getStats().getGCD() / 2);
		});
		it("should return the actor object for chaining purpose", function() {
			assert.strictEqual(actor.prepareForBattle(time), actor);
		});

	});
	describe("#setCombo", function() {

		it("should set the actor combo", function() {
			actor.setCombo("TrueThrust", time);

			assert.strictEqual(actor.combo.name, "TrueThrust");
			assert.strictEqual(actor.combo.time, time);
		});
	});
	describe("#hasCombo", function() {

		it("should return true if the combo was set within 10 seconds", function() {
			actor.setCombo("TrueThrust", time);

			assert.strictEqual(actor.hasCombo("TrueThrust", time), true);
			assert.strictEqual(actor.hasCombo("TrueThrust", time+10), true);
		});

		it("should return false if the combo name is wrong", function() {
			actor.setCombo("TrueThrust", time);

			assert.strictEqual(actor.hasCombo("VorpalThrust", time), false);
		});

		it("should return false if the time since last combo is over 10 seconds", function() {
			actor.setCombo("TrueThrust", time);

			assert.strictEqual(actor.hasCombo("TrueThrust", time+11), false);
		});
	});
	describe("#applyAuraImmediate", function() {

		it("should register new aura", function() {
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert(actor.activeAuras[0] instanceof actor.model.auras.GreasedLigthning);
			assert.strictEqual(actor.activeAuras[0].owner, actor);
		});
		it("should refresh aura", function() {
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert(actor.activeAuras[0] instanceof actor.model.auras.GreasedLigthning);
			assert.strictEqual(actor.activeAuras[0].count, 2);
		});
		it("should not register new aura if the aura cancels itself", function() {
			actor.applyAuraImmediate(actor.model.auras.PerfectBalance, actor, time);
			actor.applyAuraImmediate(actor.model.auras.RaptorForm, actor, time);

			assert(actor.findAura("PerfectBalance", actor) instanceof actor.model.auras.PerfectBalance);
			assert.strictEqual(actor.findAura("RaptorForm", actor), false);
		})

	});
	describe("#applyAura", function() {

		it("should register new auras in pending auras", function() {
			actor.applyAura(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(actor.pendingAuras[0].aura, actor.model.auras.GreasedLigthning);
		});

	});
	describe("#findAura", function() {

		it("should return false if the aura is not present", function() {
			assert.strictEqual(actor.findAura("GreasedLigthning", actor), false);
		});
		it("should return the aura if present", function() {
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert(actor.activeAuras[0] instanceof actor.model.auras.GreasedLigthning, 
				"actor.activeAuras[0] instanceof actor.model.auras.GreasedLigthning");
		});

	});
	describe("#removeAura", function() {

		it("should remove the provided aura", function() {
			actor.applyAuraImmediate(actor.model.auras.InternalRelease, actor, time);

			assert.strictEqual(actor.activeAuras.length, 1);

			actor.removeAura(actor.findAura("InternalRelease", actor));

			assert.strictEqual(actor.activeAuras.length, 0);
		});

		it("should return silently if the provided aura does not exists", function() {
			assert.strictEqual(actor.activeAuras.length, 0);

			assert.doesNotThrow(function() {
				actor.removeAura();
			});
		})
	});
	describe("#getStats", function() {

		it("should return the actor stats buffed with auras", function() {
			actor.applyAuraImmediate(actor.model.auras.InternalRelease, actor, time);

			assert.strictEqual(actor.getStats().criticalHitChance, 0.3);
		});

	});

});