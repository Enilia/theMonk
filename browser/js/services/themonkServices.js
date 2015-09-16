
angular.module('themonkServices', [])

	.factory('webReporter', function() {

		var Reporter = require('reporter'),
			WebReporter = Reporter.createReporter(function WebReporter() {
				Reporter.apply(this, arguments);
				this.damageList = [];
				this.criticalList = [];
				this.skillList = {};
				this.rotation = [];
				this.actors = {};
			}, {

				damageList: null,
				criticalList: null,
				skillList: null,
				rotation: null,
				actors: null,

				dps: 0,
				cc: 0,

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

				report: function report (options) {
					function sum(array) {
						return array.reduce(function(p,c) {
							return p+c;
						});
					}

					this.dps = sum(this.damageList) / this.simDuration;

					this.cc = sum(this.criticalList) / this.criticalList.length * 100;
				}
			});

		return function(mnkInstance, reporterOptions) {
			return new WebReporter(mnkInstance, reporterOptions);
		};

	});