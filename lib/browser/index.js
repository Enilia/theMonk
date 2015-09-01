var TheMonk = require("themonk");

var app = angular.module('themonk', []);

app.controller('ActorController', function() {

	this.models = (function() {
		var models = [];
		for(var model in TheMonk.models)
			models.push(new TheMonk.models[model]);

		return models;
	})();

	this.name = "";

	this.rotation = "";

	this.model = this.models[0];

	this.stats = {
		"weaponDamage": 				0,
		"weaponAutoAttack": 			0,
		"weaponAutoAttackDelay": 		0,
		"strength": 					0,
		"critical": 					0,
		"determination": 				0,
		"skillSpeed": 					0,
	}

});

app.directive('tmActorStats', function() {
	return {
		restrict:'E',
		templateUrl:'/templates/actor-stats.html',
	};
});

app.directive('tmSkill', function() {
	return {
		restrict:'E',
		templateUrl:'/templates/skill.html',
	};
});