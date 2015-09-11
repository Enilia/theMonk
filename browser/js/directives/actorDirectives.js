
angular.module('themonkDirectives', ['themonkServices'])

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
			scope: {
				skill: "=",
				model: "=",
				click: "=",
				skillInfo: "=",
			},
		};
	});