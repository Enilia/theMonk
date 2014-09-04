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
			stats: stats,
			rotation: fs.readFileSync(path.resolve(__dirname, rotation), "utf8"),
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

var Enilia = { // MNK ENILIA
		weaponDamage: 				53,
		weaponAutoAttack: 			46.64,
		weaponAutoAttackDelay: 		2.64,
		strength: 					552,
		critical: 					482,
		determination: 				310,
		skillSpeed: 				432,
	},
	Telral = { // MNK TELRAL
		weaponDamage: 				51,
		weaponAutoAttack: 			40.8,
		weaponAutoAttackDelay: 		2.4,
		strength: 					505,
		critical: 					465,
		determination: 				299,
		skillSpeed: 				416,
	},
	MNK_110_DTR = { // MNK 110 DTR
		weaponDamage: 				51,
		weaponAutoAttack: 			40.8,
		weaponAutoAttackDelay: 		2.4,
		strength: 					562,
		critical: 					441,
		determination: 				367,
		skillSpeed: 				397,
	},
	MNK_110_CC = { // MNK 110 CC
		weaponDamage: 				51,
		weaponAutoAttack: 			40.8,
		weaponAutoAttackDelay: 		2.4,
		strength: 					562,
		critical: 					513,
		determination: 				308,
		skillSpeed: 				415,
	},
	MNK_115_DTR = { // MNK 115 DTR
		weaponDamage: 				53,
		weaponAutoAttack: 			46.64,
		weaponAutoAttackDelay: 		2.64,
		strength: 					565,
		critical: 					468,
		determination: 				332,
		skillSpeed: 				425,
	},
	MNK_115_CC = { // MNK 115 CC
		weaponDamage: 				53,
		weaponAutoAttack: 			46.64,
		weaponAutoAttackDelay: 		2.64,
		strength: 					565,
		critical: 					547,
		determination: 				267,
		skillSpeed: 				443,
	};

console.log("");
console.log("=== MNK TELRAL (valkky) ===");
Stats.useValkkyFormulas();
sim(Telral, "Rotations/monk.rotation_2.js", time, new Reporter);

// console.log("");
// console.log("=== MNK TELRAL (ccbrown) ===");
// require("./Modules/Stats.ccbrown")
// sim(Telral, "Rotations/monk.rotation.js", time, new Reporter);

console.log("");
console.log("=== MNK ENILIA (valkky) ===");
Stats.useValkkyFormulas();
sim(Enilia, "Rotations/monk.rotation_2.js", time, new Reporter);

// console.log("");
// console.log("=== MNK ENILIA (ccbrown) ===");
// require("./Modules/Stats.ccbrown")
// sim(Enilia, "Rotations/monk.rotation.js", time, new Reporter);

console.log("");
console.log("=== MNK 110 DTR ===");
sim(MNK_110_DTR, "Rotations/monk.rotation_2.js", time, new Reporter);

console.log("");
console.log("=== MNK 110 CC ===");
sim(MNK_110_CC, "Rotations/monk.rotation_2.js", time, new Reporter);

console.log("");
console.log("=== MNK 115 DTR ===");
sim(MNK_115_DTR, "Rotations/monk.rotation_2.js", time, new Reporter);

console.log("");
console.log("=== MNK 115 CC ===");
sim(MNK_115_CC, "Rotations/monk.rotation_2.js", time, new Reporter);