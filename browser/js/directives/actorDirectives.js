
angular.module('themonkDirectives', ['themonkServices'])

	.directive('tmActor', function tmActorDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/actor.html',
			controller:'ActorController',
			scope:true,
		};
	})

	.directive('tmActorStats', function tmActorStatsDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/actor-stats.html',
			controller:'ActorStatsController',
			scope:true,
		};
	})

	.directive('tmRotation', function tmRotationDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/rotation.html',
			scope:true,
		};
	})

	.directive('tmRotationHelper', function tmRotationHelperDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/rotation-helper.html',
			controller:'ActorRotationHelperController',
			scope:true,
		};
	})

	.directive('tmSkill', function tmSkillDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/skill.html',
			link:function tmSkillLink (scope) {
				scope.skill = scope.model.skills[scope.skillInfo.name];
			}
		};
	})

	.directive('tmReport', function tmReportDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/reporter.html',
		};
	});