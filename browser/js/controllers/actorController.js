
angular.module('themonkControllers', [])

	.controller('ActorController', ['$scope', 'webReporter', function ActorController($scope, webReporter) {

		var TheMonk = require('themonk');

		$scope.name = "Monk";

		$scope.rotation = "return \"BootshineRear\"";

		$scope.stats = {
			"weaponDamage": 				1,
			"weaponAutoAttack": 			1,
			"weaponAutoAttackDelay": 		1,
			"strength": 					1,
			"critical": 					1,
			"determination": 				1,
			"skillSpeed": 					1,
		};

		$scope.progress = 0;

		$scope.simLength = 60;

		$scope.appendRotation = function appendRotation (rotation) {
			$scope.rotation += rotation;
		}

		$scope.submit = function Submit() {
			$scope.done = false;
			$scope.reporter = webReporter(
					new TheMonk().on("error", function(e) {
						console.log(e.name);
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
					.on("progress", function(time, maxTime) {
						$scope.progress = parseInt(time / maxTime * 100);
						$scope.$apply();
					})
					.addActor($scope.model.name, $scope.name, $scope.stats, $scope.rotation)
					.setMaxTime($scope.simLength)
					.run()
				)
				.on("end", function(duration) {
					$scope.done = true;
					$scope.$apply();
				});
		};

	}])

	.controller('ActorStatsController', ['$scope', function ActorStatsController($scope) {

		var TheMonk = require('themonk');

		$scope.models = (function() {
			var models = [];
			for(var model in TheMonk.models)
				models.push(new TheMonk.models[model]);

			return models;
		})();

		$scope.$parent.model = $scope.models[0];

		$scope.labels = {
			"weaponDamage": 				"Weapon Damage",
			"weaponAutoAttack": 			"Weapon Auto Attack",
			"weaponAutoAttackDelay": 		"Weapon Auto Attack Delay",
			"strength": 					"Strength",
			"critical": 					"Critical",
			"determination": 				"Determination",
			"skillSpeed": 					"Skill Speed",
		};

	}])

	.controller('ActorRotationHelperController', ['$scope', '$resource', function ActorRotationHelperController($scope, $resource) {

		$scope.skillInfos = $resource('js/json/skillsInfos.json').get();

		$scope.rotationHelper = $resource('js/json/rotation.json').get();

		$scope.addSkill = function(skill) {
			$scope.appendRotation('"' + skill.name + '"');
		};

		$scope.addVar = function(variable, $event) {
			$event.preventDefault(); // prevents form submission
			$scope.appendRotation(variable);
		};

		$scope.addFn = function(fn, args, $event) {
			$event.preventDefault(); // prevents form submission
			$scope.appendRotation(fn + "(" + args.join(", ") + ")");
		};

	}]);