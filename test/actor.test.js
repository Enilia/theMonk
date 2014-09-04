var Actor = require("../Modules/Actor"),
	assert = require("assert"),
	path = require("path"),
	fs = require("fs");


describe("Actor", function() {

	var actor,
		time;

	beforeEach(function() {
		var code = fs.readFileSync(path.resolve(__dirname, "rotations/monk.demolish.rotation.js"), "utf8");

		return function() {
			actor = new Actor({
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
				rotation: code,
			});

			actor.prepareForBattle(time = 10);
			actor.activeAuras.splice(0, actor.activeAuras.length);
			actor.pendingAuras.splice(0, actor.pendingAuras.length);
		};
	}());

	it("should throw if no model is provided", function() {
		assert.throws(function() {
			new Actor({});
		});
	});

	describe("#nextTimeOfInterest", function() {

		it("should return the time before the next time of interest", function() {
			assert.strictEqual(actor.nextTimeOfInterest(time), 0);
			assert.strictEqual(actor.nextTimeOfInterest(time - 3), 3);
		});

	});
	describe("#action", function() {

		var target, registered, SteelPeak, GCD;

		before(function() {
			GCD = actor.getStats().getGCD();
		});

		beforeEach(function() {
			registered = false;
			target = new Actor({
				model: "Monk",
				name: "Target",
				inactive: true,
			});
			SteelPeak = actor.model.skills.SteelPeak;
		});

		it("should register auto attack damage when auto attacking", function() {

			actor.on(actor.events.autoattack, function(damage, critical, _time) {
				assert.strictEqual(_time, time);
				assert.strictEqual(damage.toFixed(2), "158.75");
				assert.strictEqual(critical.toFixed(2), "0.12");
				registered = true;
			});

			actor.action(time, target); // Auto Attack

			assert(registered);

		});
		it("should update actor.nextAutoAttack according to stats", function() {

			actor.action(time, target); // Auto Attack

			assert.strictEqual(actor.nextAutoAttack, actor.getStats().getAutoAttackDelay() + time);
		});
		it("should apply skill effects", function() {

			actor.nextAutoAttack = Infinity; // bypassing auto attack
			SteelPeak.nextAvailable = Infinity; // bypassing SteelPeak

			actor.action(time, target); // Demolish (onGCD)
			actor.action(actor.nextTimeOfInterest(), target); // Demolish (onGCD)
			actor.action(actor.nextTimeOfInterest(), target); // Demolish (onGCD)
			target.action(target.nextTimeOfInterest(), target); // Demolish (onGCD)

			assert.strictEqual(actor.findAura("GreasedLigthning", actor).name, "GreasedLigthning");
			assert.strictEqual(actor.findAura("OpoOpoForm", actor).name, "OpoOpoForm");
			assert.strictEqual(target.findAura("DemolishDOT", actor).name, "DemolishDOT");

		});
		it("should register skill damage and update actor.nextAction and actor.nextOffGCD when using onGCD skills in Action window", function() {
			
			actor.on(actor.events.skill, function(damage, critical, name, _time) {
				assert.strictEqual(name, "Demolish");
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

			actor.on(actor.events.skill, function(damage, critical, name, _time) {
				assert.strictEqual(name, "SteelPeak");
				registered = true;
			});

			actor.nextAutoAttack = Infinity; // bypassing auto attack

			actor.action(time, target); // SteelPeak (offGCD)

			assert.strictEqual(actor.nextAction, time + GCD / 2);
			assert.strictEqual(actor.nextOffGCD, time + GCD);

			assert(registered);

		});
		it("should register skill damage and update actor.nextAction and actor.nextOffGCD when using offGCD skills in OffGCD window", function() {

			actor.on(actor.events.skill, function(damage, critical, name, _time) {
				assert.strictEqual(name, "SteelPeak");
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

			actor.on(actor.events.skill, function(damage, critical, name, _time) {
				assert.strictEqual(name, "Demolish");
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

			actor.on(actor.events.auraTick, function(damage, critical, name, _time) {
				assert.strictEqual(_time, time);
				assert.strictEqual(name, "DemolishDOT");
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