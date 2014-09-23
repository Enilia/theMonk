var inherits = require("util").inherits,
	extend = require("util")._extend,
	format = require("util").format;

exports.RotationError = RotationError;

function RotationError(error, args, source) {
	this.error = error;
	this.arguments = args;
	this.source = source;
}

inherits(RotationError, Error);

extend(RotationError.prototype, {
	name: "RotationError",
	arguments: null,
	source: null,
	error: null,

	getSourceErrorPosition: function() {
		var m = this.error.stack.match(/:(\d+):(\d+)/);

		return {
			line: parseInt(m[1]) - 1,
			col: parseInt(m[2])
		};
	},

	toString: function() {
		return this.name + ": " + this.message;
	},
});

Object.defineProperties(RotationError.prototype, {
	"stack": {
		configurable: true,
		enumerable: true,
		get: function() {
			var pos = this.getSourceErrorPosition(),
				source = this.source.split(/\r?\n/),
				begin = Math.max(pos.line - 1 - 1, 0),
				end = Math.min(pos.line + 1 - 1, source.length - 1),
				stack = "",
				i, isFaultyLine;

			stack += format("\n[%s] at line %d, col %d\n\n", this.toString(), pos.line, pos.col);
			for(; begin <= end; begin++) {
				isFaultyLine = (begin === pos.line - 1);
				stack += format("%s%s\n", (begin + 1 + "   ").slice(0,3), source[begin].replace(/\t/g, " "));
				isFaultyLine && (stack += format("---%s^\n", Array(pos.col).join("-")));
			}

			return stack;
		}
	},

	"message": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.error.message;
		}
	}
});