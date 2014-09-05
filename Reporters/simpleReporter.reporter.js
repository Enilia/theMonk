var Reporter = require("../Modules/Reporter"),
	util = require("util"),
	inherits = util.inherits,
	extend = util._extend,
	format = util.format;

exports = module.exports = SimpleReporter;

function SimpleReporter() {
	this.damageList = [];
	this.criticalList = [];
	this.skillList = {};
	this.startTime = -Date.now();
	this.rotation = [];
	this.actors = {};
}

inherits(SimpleReporter, Reporter);

extend(SimpleReporter.prototype, {

	registerAutoattack: function(actorName, damage, critical, time) {
		this.registerSkill(actorName, damage, critical, "autoattack", time, "autoattack");
	},

	registerSkill: function(actorName, damage, critical, skillName, time, origin) {
		this.damageList.push(damage);
		if(damage) this.criticalList.push(critical);
		this.skillList[skillName] = this.skillList[skillName] || [];
		this.skillList[skillName].push(damage);
		this.rotation.push([time, actorName, damage, critical, skillName, origin || "skill"]);
	},

	registerAuraApply: function(actorName, auraName, time) {

	},

	registerAuraTick: function(actorName, damage, critical, auraName, time) {
		this.registerSkill(actorName, damage, critical, auraName, time, "DoT");
	},

	registerAuraRefresh: function(actorName, auraName, time) {

	},

	registerAuraExpire: function(actorName, auraName, isExpired, time) {

	},

	_hook: function(actor) {
		Reporter.prototype._hook.call(this, actor);
		this.actors[actor.name] = [];
	},

	reportResume: 		0x000001,
	reportRotation: 	0x000002,
	reportSkill:		0x000004,
	reportAutoAttack:	0x000008,
	reportDoT:			0x000010,
	reportDamage:		0x000020,

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

	report: function(options, actors) {

		var makeTitle = this.makeTitle;

		options = options || this.reportResume;
		actors = actors || Object.keys(this.actors);

		if(options & this.reportRotation && (options & (this.reportSkill | this.reportAutoAttack | this.reportDoT))) {
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
					&& ( (options & this.reportSkill) && origin === "skill"
						|| (options & this.reportAutoAttack) && origin === "autoattack"
						|| (options & this.reportDoT) && origin === "DoT")
					) {

					console.log("%s | %s | %s | %s | %s%%",
						this.formatTime(time),
						makeTitle(actor, 10, ' '),
						(skillName + Array(21).join(' ')).slice(0, 20),
						(Array( 4).join(' ') + damage.toFixed(2)).slice(-7),
						(Array( 3).join(' ') + critical.toFixed(1)).slice(-6)
					);
				}
			}, this);
		}

		if(options & this.reportResume) {

			function sum(array) {
				return array.reduce(function(p,c) {
					return p+c;
				});
			}

			console.log("DPS: %s", 
				(sum(this.damageList) / this.simDuration).toFixed(2)
			);

			console.log("CC: %s%%", 
				(sum(this.criticalList) / this.criticalList.length * 100).toFixed(1)
			);

			if(options & this.reportDamage) {
				for(var skill in this.skillList) {
					console.log(" - %s [%s] : %s",
						skill,
						this.skillList[skill].length,
						(sum(this.skillList[skill]) / this.skillList[skill].length).toFixed(2)
					);
				}
			}

		}

		console.log("%ss", (this.duration/1000).toFixed(3));
	}
});