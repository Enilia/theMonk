
angular.module('themonkDirectives', ['themonkServices'])

	.directive('tmActorStats', function() {
		return {
			restrict:'E',
			templateUrl:'/templates/actor-stats.html',
		};
	})

	.directive('tmSkill', ['skillInfo', function(skillInfo) {
			return {
				restrict:'E',
				templateUrl:'/templates/skill.html',
				scope: {
					skill: "=",
					model: "=",
					click: "=",
				},
				controller: function($scope) {
					skillInfo(function(skillInfos) {
						$scope.skillInfos = skillInfos[$scope.model.name][$scope.skill.name];
					});
				},
			};
		}]);