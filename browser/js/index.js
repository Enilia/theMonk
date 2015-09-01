(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"E:\\Mes documents\\ff14\\js\\theMonk\\lib\\browser\\index.js":[function(require,module,exports){
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
},{"themonk":"themonk"}]},{},["E:\\Mes documents\\ff14\\js\\theMonk\\lib\\browser\\index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcRmxvcmlhblxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXHdhdGNoaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkU6L01lcyBkb2N1bWVudHMvZmYxNC9qcy90aGVNb25rL2xpYi9icm93c2VyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGVNb25rID0gcmVxdWlyZShcInRoZW1vbmtcIik7XHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3RoZW1vbmsnLCBbXSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignQWN0b3JDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdHRoaXMubW9kZWxzID0gKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG1vZGVscyA9IFtdO1xyXG5cdFx0Zm9yKHZhciBtb2RlbCBpbiBUaGVNb25rLm1vZGVscylcclxuXHRcdFx0bW9kZWxzLnB1c2gobmV3IFRoZU1vbmsubW9kZWxzW21vZGVsXSk7XHJcblxyXG5cdFx0cmV0dXJuIG1vZGVscztcclxuXHR9KSgpO1xyXG5cclxuXHR0aGlzLm5hbWUgPSBcIlwiO1xyXG5cclxuXHR0aGlzLnJvdGF0aW9uID0gXCJcIjtcclxuXHJcblx0dGhpcy5tb2RlbCA9IHRoaXMubW9kZWxzWzBdO1xyXG5cclxuXHR0aGlzLnN0YXRzID0ge1xyXG5cdFx0XCJ3ZWFwb25EYW1hZ2VcIjogXHRcdFx0XHQwLFxyXG5cdFx0XCJ3ZWFwb25BdXRvQXR0YWNrXCI6IFx0XHRcdDAsXHJcblx0XHRcIndlYXBvbkF1dG9BdHRhY2tEZWxheVwiOiBcdFx0MCxcclxuXHRcdFwic3RyZW5ndGhcIjogXHRcdFx0XHRcdDAsXHJcblx0XHRcImNyaXRpY2FsXCI6IFx0XHRcdFx0XHQwLFxyXG5cdFx0XCJkZXRlcm1pbmF0aW9uXCI6IFx0XHRcdFx0MCxcclxuXHRcdFwic2tpbGxTcGVlZFwiOiBcdFx0XHRcdFx0MCxcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3RtQWN0b3JTdGF0cycsIGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDonRScsXHJcblx0XHR0ZW1wbGF0ZVVybDonL3RlbXBsYXRlcy9hY3Rvci1zdGF0cy5odG1sJyxcclxuXHR9O1xyXG59KTtcclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3RtU2tpbGwnLCBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6J0UnLFxyXG5cdFx0dGVtcGxhdGVVcmw6Jy90ZW1wbGF0ZXMvc2tpbGwuaHRtbCcsXHJcblx0fTtcclxufSk7Il19
