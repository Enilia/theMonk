var Scheduled = require("../Modules/deprecated/Scheduled.js"),
	assert = require("assert");

// console.log(global);
// console.log(module);

return;

describe('Scheduled', function() {

	var scheduled;

	function dummy1() {}
	function dummy2() {}
	function dummy3() {}

	beforeEach(function() {
		scheduled = new Scheduled({
			maxTime: 30
		});
	});

	it("should be instance of Array", function() {
		assert(scheduled instanceof Array);
	});

	describe("#push", function() {
		it("should add item", function() {
			scheduled.push(dummy1, 3);
			assert.strictEqual(scheduled[0].fun, dummy1);
			assert.strictEqual(scheduled[0].time, 3);
			assert.strictEqual(scheduled.length, 1);
		});
		it("should add current @time to item time", function() {
			scheduled.time = 2;
			scheduled.push(dummy1, 3);
			assert.strictEqual(scheduled[0].time, 5);
		});
	});

	describe("#next", function() {
		var next;
		beforeEach(function() {
			scheduled.push(dummy3, 3);
			scheduled.push(dummy2, 2);
			scheduled.push(dummy1, 1);

			next = scheduled.next(); // dummy1
		});
		
		it("should return the most recent item", function() {
			assert.strictEqual(next, dummy1);
		});
		it("should remove the most recent item", function() {
			assert.strictEqual(scheduled.indexOf(next), -1);
		});
		it("should set @time with the most recent item time", function() {
			assert.strictEqual(scheduled.time, 1);
		});
		it("should return false if @maxTime >= @time", function() {
			scheduled.maxTime = 0;
			assert.strictEqual(scheduled.next(), false);
		});
		it("should return false if empty", function() {
			scheduled.splice(0, scheduled.length);
			assert.strictEqual(scheduled.next(), false);
		});

		it("should return a function with the correct 'this' pointer", function() {
			var thisp = {};
			scheduled.push(function() {
				assert.strictEqual(this, thisp);
			}, 3, thisp);
			scheduled.next()();
		});
	});


});