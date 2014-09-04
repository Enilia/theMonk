var Actor = require('./Modules/Actor'),
	Reporter = require("./Reporters/simpleReporter.reporter"),
	Simulation = require("./Modules/Simulation"),
	Stats = require("./Modules/Stats"),
	inherits = require("util").inherits,
	extend = require("util")._extend,
	path = require("path"),
	fs = require("fs");

function sim(stats, rotation, time, reporter) {
	var monk = new Actor({
			model: "Monk",
			name: "Monk",
			stats: JSON.parse(fs.readFileSync(path.resolve(__dirname, "Rotations", stats + ".stats.json"), "utf8")),
			rotation: fs.readFileSync(path.resolve(__dirname, "Rotations", rotation + ".rotation.js"), "utf8"),
		}),
		simulation = new Simulation({
			actors: [monk],
			reporter: reporter,
			Scheduled: {
				maxTime: time,
			}
		});

	simulation.run();

	reporter.report(
		reporter.reportResume
		| reporter.reportRotation
		| reporter.reportSkill
		// | reporter.reportAutoAttack
		// | reporter.reportDoT
		| reporter.reportDamage
	);
}

var time = 30;

console.log("");
console.log("=== MNK TELRAL (valkky) ===");
Stats.useValkkyFormulas();
sim("Telral", "monk_2", time, new Reporter);

// console.log("");
// console.log("=== MNK TELRAL (ccbrown) ===");
// require("./Modules/Stats.ccbrown")
// sim("Telral", "monk", time, new Reporter);

console.log("");
console.log("=== MNK ENILIA (valkky) ===");
Stats.useValkkyFormulas();
sim("Enilia", "monk_2", time, new Reporter);

// console.log("");
// console.log("=== MNK ENILIA (ccbrown) ===");
// require("./Modules/Stats.ccbrown")
// sim(Enilia, "monk", time, new Reporter);

console.log("");
console.log("=== MNK 110 DTR ===");
sim("MNK_110_DTR", "monk_2", time, new Reporter);

console.log("");
console.log("=== MNK 110 CC ===");
sim("MNK_110_CC", "monk_2", time, new Reporter);

console.log("");
console.log("=== MNK 115 DTR ===");
sim("MNK_115_DTR", "monk_2", time, new Reporter);

console.log("");
console.log("=== MNK 115 CC ===");
sim("MNK_115_CC", "monk_2", time, new Reporter);