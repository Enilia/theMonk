
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

		$scope.submit = function() {
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
					.addActor($scope.model.name, $scope.name, $scope.stats, $scope.rotation)
					.setMaxTime(600)
					.run()
					.on("progress", function(time, maxTime) {
						$scope.progress = parseInt(time / maxTime * 100);
						$scope.$apply();
					})
					.on("end", function(duration) {
						$scope.done = true;
						$scope.$apply();
					})
				);
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

		$scope.model = $scope.models[0];

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

	}]);