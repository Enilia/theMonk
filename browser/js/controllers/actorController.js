
angular.module('themonk')

	.controller('ActorController', ['themonkService', function(TheMonk) {

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

	}]);