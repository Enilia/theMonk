var Reporter = require("../Modules/Reporter"),
	util = require("util"),
	inherits = util.inherits,
	extend = util._extend,
	format = util.format;

exports = module.exports = SimpleReporter;

function SimpleReporter() {
	Reporter.apply(this, arguments);
	this.damageList = [];
	this.criticalList = [];
	this.skillList = {};
	this.rotation = [];
	this.actors = {};
}

inherits(SimpleReporter, Reporter);

extend(SimpleReporter.prototype, {

	registerAutoattack: function(actorName, damage, critical, time) {
		this.registerSkill(actorName, damage, critical, {name: "autoattack"}, time, "autoattack");
	},

	registerSkill: function(actorName, damage, critical, skill, time, origin) {
		this.damageList.push(damage);
		if(damage) this.criticalList.push(critical);
		this.skillList[skill.name] = this.skillList[skill.name] || [];
		this.skillList[skill.name].push(damage);
		this.rotation.push([time, actorName, damage, critical, skill.name, origin || "skill"]);
	},

	registerAuraApply: function(actorName, aura, time) {
		this.rotation.push([time, actorName, 0, 0, "auraapply:"+aura.name, "auraapply"]);
	},

	registerAuraTick: function(actorName, damage, critical, aura, time) {
		this.registerSkill(actorName, damage, critical, aura, time, "DoT");
	},

	registerAuraRefresh: function(actorName, aura, time) {
		this.rotation.push([time, actorName, 0, 0, "aurarefresh:"+aura.name, "aurarefresh"]);
	},

	registerAuraExpire: function(actorName, aura, isExpired, time) {
		this.rotation.push([time, actorName, 0, 0, (isExpired ? "auraexpire:" : "auracancel:")+aura.name, "auraexpire"]);
	},

	hookActor: function(actor) {
		Reporter.prototype.hookActor.call(this, actor);
		this.actors[actor.name] = [];
	},

	formatTime: function(time) {
		time = parseFloat(time.toFixed(2));

		var seconds = ('0'+parseInt(time % 60)).slice(-2),
			minutes = ('0'+parseInt(time / 60)).slice(-2);
			milli = time.toFixed(2).slice(-2);

		return minutes + ":" + seconds + " ." + milli;
	},

	makeTitle: function(title, length, filler) {
		var HalfLength = (length - title.length) / 2;

		return Array(Math.round(HalfLength)+1).join(filler || ' ')
				+ title
				+ Array(-Math.round(-HalfLength)+1).join(filler || ' ');
	},

	reportOptions: {
		Summary: 		0x000001,
		Rotation: 		0x000002,
		Skill:			0x000004,
		AutoAttack:		0x000008,
		DoT:			0x000010,
		Damage:			0x000020,
		Aura: 			0x000040,
	},

	report: function(options, actors) {

		var makeTitle = this.makeTitle;

		options = options || this.reportOptions.Summary
						   | this.reportOptions.Rotation
						   | this.reportOptions.Skill
						   | this.reportOptions.AutoAttack
						   | this.reportOptions.DoT
						   | this.reportOptions.Damage;
		actors = actors || Object.keys(this.actors);

		if(options & this.reportOptions.Rotation && (options & (this.reportOptions.Skill | this.reportOptions.AutoAttack | this.reportOptions.DoT | this.reportOptions.Aura))) {
			console.log("%s|%s|%s|%s|%s",
				makeTitle("Time", 10, '-'),
				makeTitle("Actor", 12, '-'),
				makeTitle("Skill", 22, '-'),
				makeTitle("Damage", 9, '-'),
				makeTitle("Critical", 8, '-')
			);
			this.rotation.forEach(function(line) {
				var time = line[0],
					actor = line[1],
					damage = line[2],
					critical = line[3]*100,
					skillName = line[4],
					origin = line[5];

				if(~actors.indexOf(actor)
					&& ( (options & this.reportOptions.Skill) && origin === "skill"
						|| (options & this.reportOptions.AutoAttack) && origin === "autoattack"
						|| (options & this.reportOptions.DoT) && origin === "DoT")
						|| (options & this.reportOptions.Aura) && (origin === "auraapply"
																|| origin === "aurarefresh"
																|| origin === "auraexpire")
					) {

					try {
					console.log("%s | %s | %s | %s | %s%%",
						this.formatTime(time),
						makeTitle(actor, 10, ' '),
						(skillName + Array(21).join(' ')).slice(0, 20),
						(Array( 4).join(' ') + damage.toFixed(2)).slice(-7),
						(Array( 3).join(' ') + critical.toFixed(1)).slice(-6)
					);
					} catch(e) {
						console.log(line);
						// throw e;
					}
				}
			}, this);
		}

		if(options & this.reportOptions.Summary) {

			function sum(array) {
				return array.reduce(function(p,c) {
					return p+c;
				});
			}

			console.log("Fight duration: %ds", this.simDuration);

			console.log("DPS: %s", 
				(sum(this.damageList) / this.simDuration).toFixed(2)
			);

			console.log("CC: %s%%", 
				(sum(this.criticalList) / this.criticalList.length * 100).toFixed(1)
			);

			if(options & this.reportOptions.Damage) {
				console.log("%s|%s|%s|%s",
					makeTitle("Skill", 22, '-'),
					makeTitle("#", 5, '-'),
					makeTitle("Mean Dmg", 10, '-'),
					makeTitle("Dps", 8, '-')
				);
				for(var skill in this.skillList) {
					console.log("%s | %s | %s | %s",
						(skill + Array(21).join(' ')).slice(0, 21),
						(Array( 5).join(' ') + this.skillList[skill].length).slice(-3),
						(Array(10).join(' ') + (sum(this.skillList[skill]) / this.skillList[skill].length).toFixed(2)).slice(-8),
						(Array( 7).join(' ') + (sum(this.skillList[skill]) / this.simDuration).toFixed(2)).slice(-7)
					);
					// console.log(" - %s [%s] : %s (%s)",
					// 	skill,
					// 	this.skillList[skill].length,
					// 	(sum(this.skillList[skill]) / this.skillList[skill].length).toFixed(2),
					// 	(sum(this.skillList[skill]) / this.simDuration).toFixed(2)
					// );
				}
			}

		}

		console.log("%ss", (this.duration/1000).toFixed(3));
	}
});