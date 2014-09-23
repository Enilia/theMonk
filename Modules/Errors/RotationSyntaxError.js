var inherits = require("util").inherits,
	extend = require("util")._extend,
	format = require("util").format;

exports.RotationSyntaxError = RotationSyntaxError;

function RotationSyntaxError(error, args, source) {
	this.error = error;
	this.arguments = args;
	this.source = source;
}

inherits(RotationSyntaxError, Error);

extend(RotationSyntaxError.prototype, {
	name: "RotationSyntaxError",
	arguments: null,
	source: null,
	error: null,

	toString: function() {
		return this.name + ": " + this.message;
	},
});

Object.defineProperties(RotationSyntaxError.prototype, {
	"stack": {
		configurable: true,
		enumerable: true,
		get: function() {
			var source = this.source.split(/\r?\n/),
				token = this.error.arguments[0],
				stack = "",
				index = 0, length = source.length,
				line, col,
				begin, end, isFaultyLine;

			stack += format("\n[%s]\n\n", this.toString());
			stack += "Possible error locations:\n\n";

			for(; index < length; index++) {
				line = source[index];
				if(~(col = line.indexOf(token))) {
					begin = Math.max(index - 1, 0);
					end = Math.min(index + 1, source.length - 1);

					stack += format("@%d:%d\n", index + 1, col + 1);
					for(; begin <= end; begin++) {
						isFaultyLine = (begin === index);
						stack += format("%s%s\n", (begin + 1 + "   ").slice(0,3), source[begin].replace(/\t/g, " "));
						isFaultyLine && (stack += format("   %s^\n", Array(col + 1).join(" ")));
					}
					stack += "\n";
				}
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