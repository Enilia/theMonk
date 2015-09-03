
angular.module('themonkServices', [])

	.factory('skillInfo', ['$http', function($http) {

		var skillsInfos = {},
			isReady = false,
			cbs = [];

		$http.get('js/json/skillsInfos.json').then(function(response) {
			skillsInfos = response.data;
			isReady = true;
			applyCallbacks();
		});

		function applyCallbacks() {
			cbs.forEach(function(fn) {
				fn(skillsInfos);
			});
		}

		return function(fn) {
			if(isReady) {
				fn(skillsInfos);
			} else {
				cbs.push(fn);
			}
		};
	}]);