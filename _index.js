var Reporter = require("./Reporters/simpleReporter"),
	theMonk = require("./"),
	path = require("path"),
	fs = require("fs");

function sim(stats, rotation, time, reporter, model) {

	stats = JSON.parse(fs.readFileSync(path.resolve(__dirname, "Rotations", stats + ".stats.json"), "utf8"));
	rotation = fs.readFileSync(path.resolve(__dirname, "Rotations", rotation + ".rotation.js"), "utf8");

	return (new theMonk).addActor(model, "Monk", stats, rotation)
						.setReporter(reporter)
						.setMaxTime(time)
						.run()
						.on("end", function(sim) {
							sim.report(
								Reporter.prototype.reportOptions.Summary
								// | Reporter.prototype.reportRotation
								// | Reporter.prototype.reportSkill
								// | Reporter.prototype.reportAutoAttack
								// | Reporter.prototype.reportDoT
								| Reporter.prototype.reportOptions.Damage
							);
						}).on("error", function(e) {
							// console.error(e.error.toString());
							if(e.name === "RotationError") {
								console.error(e.stack);
								console.error(e.error.stack);
							} else {
								console.error(e.stack);
							}
							process.exit(1);
						});
}

var time = 60*3;

// console.log("");
// console.log("=== MNK TELRAL (valkky) ===");
// sim("Telral", "monk_2", time, Reporter, "Monk");

// console.log("");
// console.log("=== MNK TELRAL (valkky) ===");
// sim("Telral", "monk_3", time, Reporter, "Monk");

// sim("drg", "drg", time, Reporter, "Dragoon").on("end", function() {
// 	console.log("=== DRG BIS CC (valkky) ===");
// 	console.log("");
// });

// sim("Enilia", "monk_2", time, Reporter, "Monk").on("end", function() {
// 	console.log("=== MNK ENILIA (valkky) ===");
// 	console.log("");
// });

// sim("MNK_110_DTR", "monk_2", time, Reporter, "Monk").on("end", function() {
// 	console.log("=== MNK 110 DTR ===");
// 	console.log("");
// });

// sim("MNK_110_CC", "monk_2", time, Reporter, "Monk").on("end", function() {
// 	console.log("=== MNK 110 CC ===");
// 	console.log("");
// });

sim("MNK_115_DTR", "monk_2", time, Reporter, "Monk").on("end", function() {
	console.log("=== MNK 115 DTR ===");
	console.log("");
});

sim("MNK_115_CC", "monk_2", time, Reporter, "Monk").on("end", function() {
	console.log("=== MNK 115 CC ===");
	console.log("");
});