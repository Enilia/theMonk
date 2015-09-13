var Rotation = require("../../Rotation"),
	extend = require("util")._extend;

exports = module.exports = Rotation;

extend(Rotation.prototype, {
	free: function() {
		this.script && this.script.free();
	},
})