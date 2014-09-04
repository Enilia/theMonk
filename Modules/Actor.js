var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Stats = require('./Stats'),
	Rotation = require('./Rotation'),
	models = {
		Monk: "../Models/Monk"
	};

exports = module.exports = Actor;

function Actor(conf) {
	if(!(conf.model in models))
		throw "invalid model : " + conf.model;

	EventEmitter.call(this);

	var model = require(models[conf.model]);

	this.activeAuras = [];
	this.pendingAuras = [];

	this.stats = new Stats(conf.stats);
	this.rotation = new Rotation(conf.rotation || "");
	this.model = new model;
	this.name = conf.name;
	this.inactive = !!conf.inactive;
}

inherits(Actor, EventEmitter);

extend(Actor.prototype, {

	name: "Actor",

	nextAction:Infinity,
	nextOffGCD:Infinity,
	nextAutoAttack:Infinity,

	inactive: false,

	events: {
		autoattack: "autoattack",	// (damage, critical, time)
		skill: "skill",				// (damage, critical, skillName, time)
		auraApply: "auraApply",		// (auraName, time)
		auraTick: "auraTick",		// (damage, critical, auraName, time)
		auraRefresh: "auraRefresh",	// (auraName, time)
		auraExpire: "auraExpire",	// (auraName, isExpired, time)
	},

	activeAuras: null,
	pendingAuras: null,
	stats: null,
	model: null,
	rotation: null,

	nextTimeOfInterest: function(time) {
		var next = this.pendingAuras.reduce(function(previousValue, currentValue) {
			return Math.min(previousValue, currentValue.time);
		}, Infinity);

		return Math.min(this.nextAction, this.nextAutoAttack, this.nextOffGCD, next) - (time || 0);
	},

	action: function(time, target) {

		this.preTick(time);

		var stats = this.getStats(),
			GCD, skillName,
			pendingAura = this.pendingAuras.reduce(function(previousValue, currentValue) {
				return previousValue.time < currentValue.time ?
						previousValue : currentValue;
			}, false);

		if(pendingAura && pendingAura.time === time) {

			this.applyAuraImmediate(pendingAura.aura, pendingAura.owner, pendingAura.time, pendingAura.stats);
			this.pendingAuras.splice(this.pendingAuras.indexOf(pendingAura), 1);

		} else if(this.nextAutoAttack === time) {

			this.emit(this.events.autoattack,
				stats.getAutoAttackDamage()*target.getStats().transformIncomingDamage,
				stats.getCriticalRate(),
				time
			);

			this.nextAutoAttack = stats.getAutoAttackDelay() + time;

		} 
		else {
			skillName = this.rotation.run(this, target, time);

			if(skillName && (skill = this.model.skills[skillName])) {
				GCD = stats.getGCD();

				if(skill.isOffGCD) {
					if(this.nextAction === time) {
						this.nextAction = time + GCD / 2;
						this.nextOffGCD = time + GCD;
					} else {
						// this.nextAction = time + GCD / 2;
						this.nextOffGCD = time + GCD;
					}
				} else {
					if(this.nextAction === time) {
						this.nextAction = time + GCD;
						this.nextOffGCD = time + GCD / 2;
					} else {
						// this.nextAction = time + GCD / 2;
						this.nextOffGCD = time + GCD;
						return;
					}
				}

				stats = stats.buff(skill.stats);
				this.emit(this.events.skill,
			  		stats.getSkillDamage(skill.potency)*target.getStats().transformIncomingDamage,
			  		stats.getCriticalRate(),
			  		skill.name,
			  		time
			  	);
				skill._onUse(time + GCD / 2, this, target);
			}
		}
	},

	preTick: function(time) {
		this.activeAuras.slice().forEach(function(aura) {
			if(aura.expireTime < time) {
				this.removeAura(aura, time, true);
			}
		}, this);
	},

	tick: function(time) {
		this.activeAuras.forEach(function(aura) {
			if(aura.tickDamage){
				this.emit(this.events.auraTick,
			  		aura.tickDamage,
			  		aura.tickCriticalRate,
			  		aura.name,
			  		time
			  	);
			}
		}, this);
	},

	prepareForBattle: function(time) {
		if(this.inactive) {
			return;
		}

		this.model.prepareForBattle(time, this);
		this.nextAction = this.nextAutoAttack = time;
		this.nextOffGCD = time + this.getStats().getGCD() / 2;
		
	},

	applyAura: function(aura, source, time) {
		this.pendingAuras.push({
			aura: aura,
			stats: source.getStats(),
			time: time,
			owner: source,
		});
	},

	applyAuraImmediate: function(aura, source, time, stats) {
		var _aura;

		conf = {
			stats: stats || source.getStats(),
			time: time,
			owner: source,
		};

		if(_aura = this.findAura(aura.prototype.name, source)) {
			_aura.refresh(conf);
			this.emit(this.events.auraRefresh, aura.name, time);
		} else {
			if(_aura = new aura(conf)) {
				this.activeAuras.push(_aura);
				this.emit(this.events.auraApply, aura.name, time);
			}
		}
	},

	findAura: function(auraName, source) {
		var i, l, _aura;
		for(i = 0, l = this.activeAuras.length; i < l; i++) {
			_aura = this.activeAuras[i];
			if(_aura.name === auraName && _aura.owner === source) {
				return _aura;
			}
		}
		return false;
	},

	removeAura: function(aura, time, isExpired) {
		var pos = this.activeAuras.indexOf(aura);
		if(~pos) {
			this.activeAuras.splice(pos, 1);
			this.emit(this.events.auraExpire, aura.name, isExpired, time);
		}
	},

	getStats: function() {
		return this.activeAuras.reduce(function(stats, aura) {
			return stats.buff(extend(extend({}, aura.statsMultiplier), {
				criticalHitChance: aura.additionalCriticalHitChance,
				increaseDamage: aura.increaseDamage,
				increasedAutoAttackSpeed: aura.increasedAutoAttackSpeed,
				reducedGlobalCooldown: aura.reducedGlobalCooldown,
				transformIncomingDamage: aura.transformIncomingDamage,
			}));
		}, this.stats);
	}
});