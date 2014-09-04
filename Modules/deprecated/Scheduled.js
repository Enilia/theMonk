var extend = require("util")._extend,
	inherits = require("util").inherits;

exports = module.exports = Scheduled;

function Scheduled(conf) {
	Array.call(this);
	this.maxTime = conf.maxTime || 0;
	this.time = conf.time || 0;
}

inherits(Scheduled, Array);

extend(Scheduled.prototype, {
	time: 0,
	maxTime: 0,

	next: function() {
		if(!this.length) return false;
		if(this.time >= this.maxTime) return false;

		var next = this.reduce(function(previousValue, currentValue) {
			return previousValue.time < currentValue.time ?
			       previousValue : currentValue;
		});
		this.splice(this.indexOf(next), 1);

		this.time = next.time;
		return next.fun;
	},

	push: function(fun, time, thisp) {
		if(thisp) {
			fun = fun.bind(thisp);
		}
		this.constructor.super_.prototype.push.call(this, {
			fun: fun,
			time: this.time + time
		});
	}
});