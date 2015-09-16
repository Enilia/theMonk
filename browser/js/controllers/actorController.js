
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
					new TheMonk()
					.on("error", simError)
					.on("warn", simWarn)
					.on("progress", simProgress)
					.addActor($scope.model.name, $scope.name, $scope.stats, $scope.rotation)
					.setMaxTime($scope.simLength)
					.run()
				)
				.on("end", simEnd);
		};

		function simError(error) {
			switch(error.name) {
				case "RotationError":
				case "RotationSyntaxError":
					console.error(error.stack);
					console.error(error.error.stack);
					break;
				default:
					console.error(error.stack);
			}
			throw error;
		}

		function simWarn(warn) {
			console.warn(warn);
		}

		function simProgress (time, maxTime) {
			$scope.progress = parseInt(time / maxTime * 100);
			$scope.$apply();
		}

		function simEnd (duration) {
			$scope.done = true;
			$scope.$apply();
		}

	}])

	.controller('ActorStatsController', ['$scope', function ActorStatsController($scope) {

		var TheMonk = require('themonk');

		angular.forEach(TheMonk.models, function(model) {
			this.push(new model);
		}, $scope.models = []);

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

		$scope.addSkill = function addSkill(skill) {
			$scope.appendRotation('"' + skill.name + '"');
		};

		$scope.addVar = function addVar(variable, $event) {
			$event.preventDefault(); // prevents form submission
			$scope.appendRotation(variable);
		};

		$scope.addFn = function addFn(fn, args, $event) {
			$event.preventDefault(); // prevents form submission
			$scope.appendRotation(fn + "(" + args.join(", ") + ")");
		};

	}]);