var inherits = require("util").inherits,
	extend = require("util")._extend,
	format = require("util").format;

exports.RotationError = RotationError;

function RotationError(error, arguments, source) {
	this.message = error.message;
	this.error = error;
	this.arguments = arguments;
	this.source = source;
}

inherits(RotationError, Error);

extend(RotationError.prototype, {
	name: "RotationError",
	arguments: null,
	source: null,
	error: null,

	getSourceErrorPosition: function() {
		var m = this.error.stack.match(/at undefined:(\d+):(\d+)/);

		return {
			line: parseInt(m[1]) - 1,
			col: parseInt(m[2])
		};
	},
});

Object.defineProperty(RotationError.prototype, "stack", {
	configurable: true,
	enumerable: true,
	get: function() {
		var pos = this.getSourceErrorPosition(),
			source = this.source.split(/\r?\n/),
			begin = Math.max(pos.line - 1 - 1, 0),
			end = Math.min(pos.line + 1 - 1, source.length - 1),
			stack = "",
			i, isFaultyLine;

		stack += format("[%s] at line %d, col %d\n\n", this.toString(), pos.line, pos.col);
		for(; begin <= end; begin++) {
			isFaultyLine = (begin === pos.line - 1);
			stack += format("%s%s\n", (begin + 1 + "   ").slice(0,3), source[begin].replace(/^\t/, " "));
			isFaultyLine && (stack += format("---%s^\n", Array(pos.col).join("-")));
		}

		return stack;
	}
})