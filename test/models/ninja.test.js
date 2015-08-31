var Actor = require("../../lib/Actor"),
	assert = require("assert"),
	path = require("path"),
	fs = require("fs");


describe("Model/Ninja", function() {

	var actorConf = {
			model: "Ninja",
			name: "Ninja",
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
						, "../rotations/ninja.actor.test.rotation"
					), "utf8"
				),
		},
		targetConf = {
			model: "Monk",
			name: "Target",
			inactive: true,
		},
		actor,
		target,
		time;

	beforeEach(function() {
		actor = new Actor(actorConf);
		target = new Actor(targetConf);
		time = 10;

		actor.prepareForBattle(time);
		actor.activeAuras.splice(0, actor.activeAuras.length);
		actor.pendingAuras.splice(0, actor.pendingAuras.length);

		actor.nextAutoAttack = actor.nextOffGCD = Infinity;
	});

	describe("mudras", function() {
		it("should lock animations", function() {
			actor.action(time, target);

			assert.strictEqual(actor.nextTimeOfInterest(time), 1.5);
		});

		xit("should cycle through Huton/Suiton/Raiton", function() {
			var aura;

			actor.action(time, target);

			assert.strictEqual(actor.findAura("Mudra", actor).mudra, "Huton");

			actor.action(time, target);
		});
	});

});