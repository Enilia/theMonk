var Rotation = require("../lib/Rotation"),
	Actor = require("../lib/Actor"),
	RotationError = require("../lib/Errors/RotationError").RotationError,
	RotationSyntaxError = require("../lib/Errors/RotationSyntaxError").RotationSyntaxError,
	Script = require("vm"),
	assert = require("assert"),
	path = require("path"),
	fs = require("fs");

function getRotation(filename) {
	return new Rotation(fs.readFileSync(path.resolve(__dirname, "rotations", "monk."+filename+".rotation.js"), "utf8")).prepare();
}

describe("Rotation", function() {

	var actor, time, target;

	beforeEach(function() {
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
		});
		target = new Actor({
			model: "Monk",
			name: "Target",
			inactive: true,
		});
		actor.prepareForBattle(time = 10);
	});

	describe("#prepare", function() {

		it("should create a script instance from the source", function() {
			var rotation = new Rotation("").prepare();

			assert(rotation.script instanceof Script);
		});

		describe("Exceptions", function() {

			describe("RotationSyntaxError", function() {

				it("should emit an error event when the rotation has syntax errors", function() {
					assert.throws(function() {
						new Rotation("if() &").prepare();
					}, function(error) {
						return /if\(\) \&/.test(error.stack);
					});
				});
			});
			
		});
	});

	describe("#run", function() {

		it("should return undefined when the rotation does not return", function() {
			var rotation = getRotation("empty");

			assert.strictEqual(rotation.run(), void(0));
		});

		it("should return the skillname provided by the rotation file", function() {
			var rotation = getRotation("skillname");

			assert.strictEqual(rotation.run(), "skillname");
		});

		describe("Exceptions", function() {

			describe("RotationError", function() {
				var error;

				before(function() {
					var rotation = getRotation("RotationError");

					rotation.on("error", function(e) {
						error = e;
					});

					rotation.run();
				});

				it("should emit an error event when the rotation fail", function() {
					assert(error instanceof RotationError);
				});

				describe("#getSourceErrorPosition", function() {

					it("should return the error position", function() {
						assert.deepEqual(error.getSourceErrorPosition(), {
							line: 6,
							col: 2,
						});
					});
				});

				describe(".stack", function() {

					it("should show the faulty line", function() {
						assert(/bar\(\); \/\/ should throw/.test(error.stack));
					});

				});
			});
		});

	});

	describe("#AuraCount", function() {

		it("should return 0 if the searched aura does not validate the provided condition (name and source)", function() {
			var rotation = getRotation("bad.AuraCount");

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 0);
		});

		it("should return the stack count of the searched aura", function() {
			var rotation = getRotation("good.AuraCount");

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 1);

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 2);

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 3);

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 3);
		});

	});

	describe("#IsReady", function() {

		it("should return true if the searched skill can be casted", function() {
			var rotation = getRotation("IsReady");

			assert.strictEqual(rotation.run(actor, target, time), true);

			actor.model.skills.InternalRelease._onUse(time, actor, target);

			assert.strictEqual(rotation.run(actor, target, time + actor.model.skills.InternalRelease.recast + 1), true);
		});
		it("should return false if the searched skill can't be casted", function() {
			var rotation = getRotation("IsReady");

			actor.model.skills.InternalRelease._onUse(time, actor, target);

			assert.strictEqual(rotation.run(actor, target, time), false);
		});

	});

	describe("#IsOffGCD", function() {

		it("should return true if the actor is on a off GCD state", function() {
			var rotation = getRotation("IsOffGCD");

			actor.prepareForBattle(time);

			assert.strictEqual(rotation.run(actor, target, actor.nextAction), false);

			actor.nextAction = actor.nextAutoAttack = actor.nextOffGCD + 1;

			assert.strictEqual(rotation.run(actor, target, actor.nextOffGCD), true);
		});

	});

	describe("#AuraTimeRemaining", function() {

		it("should return 0 if the searched aura does not validate the provided condition (name and source)", function() {
			var rotation = getRotation("AuraTimeRemaining");

			assert.strictEqual(rotation.run(actor, target, time), 0);
		});

		it("should return the time remaining of the searched aura", function() {
			var rotation = getRotation("AuraTimeRemaining");

			actor.applyAuraImmediate(actor.model.auras.GreasedLigthning, actor, time);

			assert.strictEqual(rotation.run(actor, target, time), 12);
		});

	});

	describe("#GCD", function() {

		it("should return the actor GCD", function() {
			var rotation = getRotation("GCD");

			assert.strictEqual(rotation.run(actor, target, time).toFixed(2), "2.44");
		});

	});

	describe("#CooldownRemaining", function() {

		it("should return the time remaining before the skill next use", function() {
			var rotation = getRotation("CooldownRemaining");

			assert.strictEqual(rotation.run(actor, target, time), 0);

			actor.model.skills.InternalRelease._onUse(time, actor, target);

			assert.strictEqual(rotation.run(actor, target, time), actor.model.skills.InternalRelease.recast);
		});

	});

});