var Reporter = require("./Reporters/simpleReporter"),
	theMonk = require("./"),
	path = require("path"),
	fs = require("fs");

function sim(stats, rotation, time, reporter) {

	stats = JSON.parse(fs.readFileSync(path.resolve(__dirname, "Rotations", stats + ".stats.json"), "utf8"));
	rotation = fs.readFileSync(path.resolve(__dirname, "Rotations", rotation + ".rotation.js"), "utf8");

	return (new theMonk).addActor("Monk", "Monk", stats, rotation)
						.setReporter(reporter)
						.setMaxTime(time)
						.run()
						.on("end", function(sim) {
							sim.report(
								Reporter.prototype.reportOptions.Resume
								// | Reporter.prototype.reportRotation
								// | Reporter.prototype.reportSkill
								// | Reporter.prototype.reportAutoAttack
								// | Reporter.prototype.reportDoT
								// | Reporter.prototype.reportOptions.Damage
							);
						});
}

var time = 60*3;

// console.log("");
// console.log("=== MNK TELRAL (valkky) ===");
// sim("Telral", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK TELRAL (valkky) ===");
// sim("Telral", "monk_3", time, Reporter);

sim("Enilia", "monk_2", time, Reporter).on("end", function() {
	console.log("=== MNK ENILIA (valkky) ===");
	console.log("");
});

// sim("MNK_110_DTR", "monk_2", time, Reporter).on("end", function() {
// 	console.log("=== MNK 110 DTR ===");
// 	console.log("");
// });

// sim("MNK_110_CC", "monk_2", time, Reporter).on("end", function() {
// 	console.log("=== MNK 110 CC ===");
// 	console.log("");
// });

sim("MNK_115_DTR", "monk_2", time, Reporter).on("end", function() {
	console.log("=== MNK 115 DTR ===");
	console.log("");
});

sim("MNK_115_CC", "monk_2", time, Reporter).on("end", function() {
	console.log("=== MNK 115 CC ===");
	console.log("");
});