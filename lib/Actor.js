var extend = require("util")._extend,
	inherits = require("util").inherits,
	EventEmitter = require("events").EventEmitter,
	Stats = require('./Stats'),
	Rotation = require('./Rotation'),
	models = {
		Monk: require("../Models/Monk"),
		Dragoon: require("../Models/Dragoon"),
		Ninja: require("../Models/Ninja"),
	};

exports = module.exports = Actor;

function Actor(conf) {
	EventEmitter.call(this);

	this.activeAuras = [];
	this.pendingAuras = [];
	this.combo = {
		name: "",
		time: null,
	};

	this.stats = new Stats(conf.stats);
	this.rotation = new Rotation(conf.rotation || "");
	this.modelName = conf.model;
	this.name = conf.name;
	this.inactive = !!conf.inactive;

	this.rotation.on("error", this.emit.bind(this, "error"));
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
		skill: "skill",				// (damage, critical, skill, time)
		auraApply: "auraApply",		// (aura, time)
		auraTick: "auraTick",		// (damage, critical, aura, time)
		auraRefresh: "auraRefresh",	// (aura, time)
		auraExpire: "auraExpire",	// (aura, isExpired, time)
	},

	activeAuras: null,
	pendingAuras: null,
	stats: null,
	model: null,
	modelName: null,
	rotation: null,
	combo: null,

	nextTimeOfInterest: function(time) {
		var next = this.pendingAuras.reduce(function(previousValue, currentValue) {
			return Math.min(previousValue, currentValue.time);
		}, Infinity);

		return Math.min(this.nextAction, this.nextAutoAttack, this.nextOffGCD, next) - time;
	},

	action: function(time, target) {

		var stats = this.getStats(),
			targetStats = target.getStats(),
			GCD, skillName;

		switch(time) {
			case this.nextAutoAttack:
				this.emit(this.events.autoattack,
					stats.getAutoAttackDamage()*targetStats.transformIncomingDamage/targetStats[this.model.damageType],
					stats.getCriticalRate(),
					time
				);

				this.nextAutoAttack = stats.getAutoAttackDelay() + time;
				break;
			case this.nextAction:
			case this.nextOffGCD:
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
							break;
						}
						this.setCombo(skill.name, time);
					}

					this.nextAction = Math.max(this.nextAction, time + skill.animationLock);
					this.nextOffGCD = Math.max(this.nextOffGCD, time + skill.animationLock);

					stats = stats.buff(skill.stats);
					this.emit(this.events.skill,
				  		skill.getPotency(this, target, time) && stats.getSkillDamage(skill.getPotency(this, target, time))*targetStats.transformIncomingDamage/targetStats[skill.damageType],
				  		stats.getSkillCriticalRate(),
				  		skill,
				  		time
				  	);
					skill._onUse(Math.min(this.nextAction, this.nextOffGCD), this, target);
				} else {
					this.emit("error", new Error(skillName + " is not a valid skill"));
				}
				break;
			default:
				this.emit("error", new Error("unoptimized action call \n"
											+ "name: " + this.name + "\n"
											+ "time: " + time));
		}
	},

	preTick: function(time) {

		this.pendingAuras.slice().forEach(function(pendingAura) {
			if(pendingAura.time === time) {
				this.applyAuraImmediate(pendingAura.aura, pendingAura.owner, pendingAura.time, pendingAura.stats, pendingAura.tstats);
				this.pendingAuras.splice(this.pendingAuras.indexOf(pendingAura), 1);
			}
		}, this);

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
			  		aura,
			  		time
			  	);
			}
		}, this);
	},

	prepareForBattle: function(time) {
		if(!(this.modelName in models))
			this.emit("error", new Error("invalid model : " + this.modelName));

		this.model = new (models[this.modelName]);
		this.rotation.prepare();

		if(this.inactive) {
			return this;
		}

		this.model.prepareForBattle(time, this);
		this.nextAction = this.nextAutoAttack = time;
		this.nextOffGCD = time + this.getStats().getGCD() / 2;

		return this;
		
	},

	setCombo: function(combo, time) {
		this.combo = {
			name: combo,
			time: time, 
		};
	},

	hasCombo: function(combo, time) {
		return (this.combo.name === combo) && (time - this.combo.time <= 10);
	},

	applyAura: function(aura, source, time) {
		this.pendingAuras.push({
			aura: aura,
			stats: source.getStats(),
			tstats: this.getStats(),
			time: time,
			owner: source,
		});
	},

	applyAuraImmediate: function(aura, source, time, stats, tstats) {
		var _aura = this.findAura(aura.prototype.name, source);

		conf = {
			stats: stats || source.getStats(),
			tstats: tstats,
			time: time,
			owner: source,
		};

		conf.stats.skillCriticalHitChance = 0; // DoTs don't benefit this

		if(_aura && _aura.onApply(source, time) !== false) {
			_aura.refresh(conf);
			this.emit(this.events.auraRefresh, _aura, time);
		} else {
			_aura = new aura(conf);
			if(_aura.onApply(source, time) !== false) {
				this.activeAuras.push(_aura);
				this.emit(this.events.auraApply, _aura, time);
			}
		}

		return _aura;
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
			this.emit(this.events.auraExpire, aura, isExpired, time);
		}
	},

	getStats: function() {
		return this.activeAuras.reduce(function(stats, aura) {
			return stats.buff(extend(extend({}, aura.statsMultiplier), {
				criticalHitChance: aura.additionalCriticalHitChance,
				skillCriticalHitChance: aura.additionalSkillCriticalHitChance,
				increaseDamage: aura.increaseDamage,
				increasedAutoAttackSpeed: aura.increasedAutoAttackSpeed,
				reducedGlobalCooldown: aura.reducedGlobalCooldown,
				transformIncomingDamage: aura.transformIncomingDamage,
				BLUNT: aura.bluntResist,
				SLASH: aura.slashResist,
				PIERCING: aura.piercingResist,
				MAGIC: aura.magicResist,
			}));
		}, this.stats);
	},

	free: function() {
		this.rotation.free();
	},
});