
angular.module('themonkControllers', [])

	.controller('ActorController', ['$scope', 'themonk', '$resource', function($scope, TheMonk, $resource) {

		$scope.models = (function() {
			var models = [];
			for(var model in TheMonk.models)
				models.push(new TheMonk.models[model]);

			return models;
		})();

		$scope.name = "";

		$scope.rotation = "";

		$scope.model = $scope.models[0];

		$scope.skillInfos = $resource('js/json/skillsInfos.json').get();

		$scope.rotationHelper = $resource('js/json/rotation.json').get();

		$scope.stats = {
			"weaponDamage": 				0,
			"weaponAutoAttack": 			0,
			"weaponAutoAttackDelay": 		0,
			"strength": 					0,
			"critical": 					0,
			"determination": 				0,
			"skillSpeed": 					0,
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
					console.log("%d %d", time, maxTime);
				})
				.on("end", function(duration) {
					console.log("done");
				});
		};

	}]);