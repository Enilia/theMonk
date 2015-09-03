
angular.module('themonkControllers', [])

	.controller('ActorController', ['$scope', 'themonkService', function($scope, TheMonk) {

		$scope.models = (function() {
			var models = [];
			for(var model in TheMonk.models)
				models.push(new TheMonk.models[model]);

			return models;
		})();

		$scope.name = "";

		$scope.rotation = "";

		$scope.model = $scope.models[0];

		$scope.stats = {
			"weaponDamage": 				0,
			"weaponAutoAttack": 			0,
			"weaponAutoAttackDelay": 		0,
			"strength": 					0,
			"critical": 					0,
			"determination": 				0,
			"skillSpeed": 					0,
		}

	}]);