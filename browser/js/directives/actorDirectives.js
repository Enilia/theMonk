
angular.module('themonkDirectives', [])

	.directive('tmActorStats', function() {
		return {
			restrict:'E',
			templateUrl:'/templates/actor-stats.html',
		};
	})

	.directive('tmSkill', function() {
		return {
			restrict:'E',
			templateUrl:'/templates/skill.html',
		};
	});