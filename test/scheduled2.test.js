var Scheduled = require("../lib/Scheduled2"),
	assert = require("assert");

describe('Scheduled2', function() {

	var scheduled, 
		conf = {
			maxTime: 30,
			time: 5,
		};

	function dummy1() {}
	function dummy2() {}
	function dummy3() {}

	beforeEach(function() {
		scheduled = new Scheduled(conf);
	});

	describe("#register", function() {
		it("should add item", function() {
			scheduled.register("dummy1", dummy1, 3);
			assert.strictEqual(scheduled.listeners["dummy1"].fun, dummy1);
			assert.strictEqual(scheduled.listeners["dummy1"].time, 3 + scheduled.time);
		});
		it("should add current @time to item time", function() {
			scheduled.time = 2;
			scheduled.register("dummy1", dummy1, 3);
			assert.strictEqual(scheduled.listeners["dummy1"].time, 3 + scheduled.time);
		});
		it("should replace items with same name if the provided item is scheduled  earlier", function() {
			scheduled.register("dummy1", dummy1, 3);
			scheduled.register("dummy1", dummy2, 2);
			assert.strictEqual(scheduled.listeners["dummy1"].fun, dummy2);
			assert.strictEqual(scheduled.listeners["dummy1"].time, 2 + scheduled.time);
		});
		it("should not replace items with same name if the provided item is scheduled later", function() {
			scheduled.register("dummy1", dummy1, 2);
			scheduled.register("dummy1", dummy2, 3);
			assert.strictEqual(scheduled.listeners["dummy1"].fun, dummy1);
			assert.strictEqual(scheduled.listeners["dummy1"].time, 2 + scheduled.time);
		})
	});

	describe("#next", function() {
		var next;
		beforeEach(function() {
			scheduled.register("dummy3", dummy3, 3);
			scheduled.register("dummy2", dummy2, 2);
			scheduled.register("dummy1", dummy1, 1);

			next = scheduled.next(); // dummy1
		});
		
		it("should return the most recent item", function() {
			assert.strictEqual(next, dummy1);
		});
		it("should remove the most recent item", function() {
			assert.strictEqual(scheduled.listeners["dummy1"], void(0));
		});
		it("should set @time with the most recent item time", function() {
			assert.strictEqual(scheduled.time, conf.time + 1);
		});
		it("should return false if @maxTime >= @time", function() {
			scheduled.maxTime = 0;
			assert.strictEqual(scheduled.next(), false);
		});
		it("should return false if empty", function() {
			scheduled.next(); // dummy2
			scheduled.next(); // dummy3
			assert.strictEqual(scheduled.next(), false);
		});

		it("should return a function with the correct 'this' pointer", function() {
			var thisp = {};
			scheduled.register("thisp", function() {
				assert.strictEqual(this, thisp);
			}, 0, thisp);
			scheduled.next()();
		});
	});


});