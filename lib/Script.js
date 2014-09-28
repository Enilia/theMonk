var vm = require("vm").Script,
	inherits = require("util").inherits,
	extend = require("util")._extend;

exports = module.exports = Script;

inherits(Script, vm);

function Script(code) {
    if (!(this instanceof Script)) return new Script(code);
	vm.call(this, code);
}

extend(Script.prototype, {

	free: function() {},

});