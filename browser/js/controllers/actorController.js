
angular.module('themonkControllers', [])

	.controller('ActorController', ['$scope', '$resource', function($scope, $resource) {

		var TheMonk = require('themonk');

		$scope.models = (function() {
			var models = [];
			for(var model in TheMonk.models)
				models.push(new TheMonk.models[model]);

			return models;
		})();

		$scope.name = "Monk";

		$scope.rotation = "return \"BootshineRear\"";

		$scope.model = $scope.models[0];

		$scope.skillInfos = $resource('js/json/skillsInfos.json').get();

		$scope.rotationHelper = $resource('js/json/rotation.json').get();

		$scope.stats = {
			"weaponDamage": 				1,
			"weaponAutoAttack": 			1,
			"weaponAutoAttackDelay": 		1,
			"strength": 					1,
			"critical": 					1,
			"determination": 				1,
			"skillSpeed": 					1,
		};

		$scope.addSkill = function(skill) {
			$scope.rotation = $scope.rotation + '"' + skill.name + '"';
		};

		$scope.addVar = function(variable, $event) {
			$event.preventDefault();
			$scope.rotation = $scope.rotation + variable;
		};

		$scope.addFn = function(fn, args, $event) {
			$event.preventDefault();
			$scope.rotation = $scope.rotation + fn + "(" + args.join(", ") + ")";
		};

		$scope.submit = function() {
			new TheMonk().on("error", function(e) {
					switch(e.name) {
						case "RotationError":
						case "RotationSyntaxError":
							console.error(e.stack);
							console.error(e.error.stack);
							break;
						default:
							console.error(e.stack);
					}
					throw e;
				})
				.on("warn", function(warn) {
					console.warn(warn);
				})
				.addActor($scope.model.name, $scope.name, $scope.stats, $scope.rotation)
				.setMaxTime(600)
				.run()
				.on("progress", function(time, maxTime) {
					console.log("%d%%", parseInt(time / maxTime * 100));
				})
				.on("end", function(duration) {
					console.log("done");
				});
		};

	}]);