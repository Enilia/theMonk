var extend = require("util")._extend;

exports = module.exports = Scheduled;

function Scheduled(conf) {
	conf = conf || {};
	this.maxTime = conf.maxTime || 0;
	this.time = conf.time || 0;
	this.listeners = {};
}

extend(Scheduled.prototype, {
	time: 0,
	maxTime: 0,
	listeners: null,

	next: function() {
		if(this.isEmpty()) return false;
		if(this.isExpired(this.time)) return false;

		var next, name, _next, _name;
		for(_name in this.listeners) {
			_next = this.listeners[_name];
			if(!next || _next.time < next.time) {
				next = _next;
				name = _name;
			}
		}

		delete this.listeners[name];

		this.time = next.time;
		if(this.isExpired(this.time)) return false;
		return next.fun;
	},

	register: function(name, fun, time, thisp) {
		var listener;

		if(listener = this.listeners[name]) {
			if(listener.time <= (this.time + time)) return;
		}

		this.listeners[name] = {
			fun: thisp ? fun.bind(thisp) : fun,
			time: this.time + time
		};
	},

	isEmpty: function() {
		for(var i in this.listeners) {
			return false;
		}
		return true;
	},

	isExpired: function(time) {
		return time > this.maxTime;
	},
});