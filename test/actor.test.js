var Actor = require("../Modules/Actor"),
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

	describe("new Actor", function() {

		it("should throw if no argument is provided", function() {
			assert.throws(function() {
				new Actor;
			});
		});

		it("should throw if no model is provided", function() {
			assert.throws(function() {
				new Actor({});
			});
		});

	});

	describe("#nextTimeOfInterest", function() {

		it("throws if missing first argument", function() {
			assert.throws(function() {
				actor.nextTimeOfInterest();
			});
		});

		describe("should return the time before the next time of interest", function() {

			it("at time", function() {
				assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			});

			it("at time - x", function() {
				assert.strictEqual(actor.nextTimeOfInterest(time - 3), 3);
			});

			it("at time + x", function() {
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
			target, registered, SteelPeak, Demolish, GCD;

		before(function() {
			GCD = actor.getStats().getGCD();
		});

		beforeEach(function() {
			registered = false;
			target = new Actor(targetConf);
			SteelPeak = actor.model.skills.SteelPeak;
			Demolish = actor.model.skills.Demolish;
		});

		describe("when auto attacking", function() {
			var eventDamage, eventCritical, eventTime;

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
			var eventDamage, eventCritical, eventSkill, eventTime;

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
		});

		xit("should apply skill effects", function() {

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			actor.action(time, target); // Demolish (onGCD)
			actor.action(actor.nextTimeOfInterest(), target); // OpoOpoForm (auraApply)
			actor.action(actor.nextTimeOfInterest(), target); // GreasedLigthning (auraApply)
			target.action(target.nextTimeOfInterest(), target); // Demolish (auraApply)

			assert.strictEqual(actor.findAura("GreasedLigthning", actor).name, "GreasedLigthning");
			assert.strictEqual(actor.findAura("OpoOpoForm", actor).name, "OpoOpoForm");
			assert.strictEqual(target.findAura("DemolishDOT", actor).name, "DemolishDOT");

		});
		it("should set actor.combo when using onGCD skills", function() {

			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "Demolish");
				registered = true;
			});

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			actor.action(time, target); // Demolish (onGCD)

			assert.strictEqual(actor.combo.name, "Demolish");
			assert.strictEqual(actor.combo.time, time);

			assert(registered);
		});
		it("should not set actor.combo when using offGCD skills", function() {

			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "SteelPeak");
				registered = true;
			});

			actor.nextAutoAttack = Infinity; // bypassing auto attack

			actor.action(time, target); // SteelPeak (offGCD)

			assert.strictEqual(actor.combo.name, "");
			assert.strictEqual(actor.combo.time, null);

			assert(registered);
		});
		it("should preserve actor.combo when using offGCD skills", function() {

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			// DEMOLISH
			actor.once(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "Demolish");
				registered = true;
			});
			actor.action(time, target); // Demolish (onGCD)
			assert(registered);
			registered = false;

			// STEELPEAK
			actor.once(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "SteelPeak");
				registered = true;
			});
			SteelPeak.nextAvailable = 0; // enabling SteelPeak
			actor.action(time + GCD, target); // SteelPeak (offGCD)

			assert.strictEqual(actor.combo.name, "Demolish");
			assert.strictEqual(actor.combo.time, time);

			assert(registered);
		});
		it("should register skill damage and update actor.nextAction and actor.nextOffGCD when using onGCD skills in Action window", function() {
			
			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "Demolish");
				registered = true;
			});

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			actor.action(time, target); // Demolish (onGCD)

			assert.strictEqual(actor.nextAction, time + GCD);
			assert.strictEqual(actor.nextOffGCD, time + GCD / 2);

			assert(registered);
		});
		it("should register skill damage and update actor.nextAction and actor.nextOffGCD when using offGCD skills in Action window", function() {

			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "SteelPeak");
				registered = true;
			});

			actor.nextAutoAttack = Infinity; // bypassing auto attack

			actor.action(time, target); // SteelPeak (offGCD)

			assert.strictEqual(actor.nextAction, time + GCD / 2);
			assert.strictEqual(actor.nextOffGCD, time + GCD);

			assert(registered);

		});
		it("should register skill damage and update actor.nextAction and actor.nextOffGCD when using offGCD skills in OffGCD window", function() {

			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "SteelPeak");
				registered = true;
			});

			actor.nextAction = time + GCD;
			actor.nextOffGCD = time + GCD / 2;
			time = actor.nextOffGCD;

			actor.nextAutoAttack = Infinity; // bypassing auto attack

			actor.action(time, target); // SteelPeak (offGCD)

			assert.strictEqual(actor.nextAction, time + GCD / 2);
			assert.strictEqual(actor.nextOffGCD, time + GCD);

			assert(registered);
		});
		it("should not register skill damage and update actor.nextAction and actor.nextOffGCD when using onGCD skills in OffGCD window", function() {

			actor.on(actor.events.skill, function(damage, critical, skill, _time) {
				assert.strictEqual(skill.name, "Demolish");
				registered = true;
			});

			actor.nextAction = time + GCD;
			actor.nextOffGCD = time + GCD / 2;
			time = actor.nextOffGCD;

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			actor.action(time, target); // Demolish (onGCD)

			assert.strictEqual(actor.nextAction, time + GCD / 2);
			assert.strictEqual(actor.nextOffGCD, time + GCD);

			assert(!registered);
		});

	});
	describe("#preTick", function() {

		it("should remove expired auras from the actor", function() {

			assert.strictEqual(actor.activeAuras.length, 0);

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);
			actor.applyAuraImmediate(actor.model.auras.TwinSnakes, actor, time);

			assert.strictEqual(actor.activeAuras.length, 2);

			actor.preTick(time+13); // GreasedLigthning expired

			assert.strictEqual(actor.activeAuras.length, 1);

			actor.preTick(time+16); // TwinSnakes expired

			assert.strictEqual(actor.activeAuras.length, 0);
		});

	});
	describe("#tick", function() {

		it("should register DoTs damage", function() {

			var registered = false;

			actor.on(actor.events.auraTick, function(damage, critical, skill, _time) {
				assert.strictEqual(_time, time);
				assert.strictEqual(skill.name, "DemolishDOT");
				assert.strictEqual(damage.toFixed(2), "74.12");
				assert.strictEqual(critical.toFixed(2), "0.12");
				registered = true;
			});

			actor.applyAuraImmediate(actor.model.auras.DemolishDOT, actor, time);

			actor.tick(time);

			assert(registered);
		});

	});
	describe("#prepareForBattle", function() {

		it("should do nothing on inactive actor", function() {
			var target = new Actor({
					model: "Monk",
					name: "Target",
					inactive: true,
				});

			target.prepareForBattle(time);

			assert.strictEqual(actor.findAura("FistOfFire", actor), false);
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

			assert.strictEqual(actor.activeAuras[0].name, "GreasedLigthning");
			assert.strictEqual(actor.activeAuras[0].owner, actor);
		});
		it("should refresh aura", function() {
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(actor.activeAuras[0].name, "GreasedLigthning");
			assert.strictEqual(actor.activeAuras[0].count, 2);
		});
		it("should not register new aura if the aura cancels itself", function() {
			actor.applyAuraImmediate(actor.model.auras.PerfectBalance, actor, time);
			actor.applyAuraImmediate(actor.model.auras.RaptorForm, actor, time);

			assert.strictEqual(actor.findAura("PerfectBalance", actor).name, "PerfectBalance");
			assert.strictEqual(actor.findAura("RaptorForm", actor), false);
		})

	});
	describe("#applyAura", function() {

		it("should register new auras in pending auras");

	});
	describe("#findAura", function() {

		it("should return false if the aura is not present", function() {
			assert.strictEqual(actor.findAura("GreasedLigthning", actor), false);
		});
		it("should return the aura if present", function() {
			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(actor.findAura("GreasedLigthning", actor).name, "GreasedLigthning");
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