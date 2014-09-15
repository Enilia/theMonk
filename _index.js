var Reporter = require("./Reporters/simpleReporter"),
	theMonk = require("./"),
	path = require("path"),
	fs = require("fs");

function sim(stats, rotation, time, reporter) {

	stats = JSON.parse(fs.readFileSync(path.resolve(__dirname, "Rotations", stats + ".stats.json"), "utf8"));
	rotation = fs.readFileSync(path.resolve(__dirname, "Rotations", rotation + ".rotation.js"), "utf8");

	(new theMonk).addActor("Monk", "Monk", stats, rotation)
				 .setReporter(reporter)
				 .setMaxTime(time)
				 .run()
				 // .useCcbrownFormulas()
				 .report(
						Reporter.prototype.reportResume
						| Reporter.prototype.reportRotation
						// | Reporter.prototype.reportSkill
						// | Reporter.prototype.reportAutoAttack
						// | Reporter.prototype.reportDoT
						| Reporter.prototype.reportDamage
			 	 );
}

var time = 60*3;

console.log("");
console.log("=== MNK TELRAL (valkky) ===");
sim("Telral", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK TELRAL (valkky) ===");
// sim("Telral", "monk_3", time, Reporter);

console.log("");
console.log("=== MNK ENILIA (valkky) ===");
sim("Enilia", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK 110 DTR ===");
// sim("MNK_110_DTR", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK 110 CC ===");
// sim("MNK_110_CC", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK 115 DTR ===");
// sim("MNK_115_DTR", "monk_2", time, Reporter);

// console.log("");
// console.log("=== MNK 115 CC ===");
// sim("MNK_115_CC", "monk_2", time, Reporter);