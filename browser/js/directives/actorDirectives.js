
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
			scope:{
				model:'=',
				name:'=',
				stats:'=',
			},
		};
	})

	.directive('tmRotation', function tmRotationDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/rotation.html',
			scope:{
				rotation:'=',
			}
		};
	})

	.directive('tmRotationHelper', function tmRotationHelperDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/rotation-helper.html',
			controller:'ActorRotationHelperController',
			scope:{
				rotation:'=',
				model:'=',
			},
		};
	})

	.directive('tmSkill', function tmSkillDirective() {
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
	})

	.directive('tmReport', function tmReportDirective() {
		return {
			restrict:'E',
			templateUrl:'/templates/reporter.html',
		};
	});