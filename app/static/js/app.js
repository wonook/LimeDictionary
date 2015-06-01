'use strict';

angular.module('AngularFlask', ['angularFlaskServices', 'ui.router', 'ngTagsInput'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
		function($locationProvider, $stateProvider, $urlRouterProvider) {
			$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/static/partials/landing.html',
				controller: IndexController
			})
			.state('about', {
				url: '/about',
				templateUrl: '/static/partials/about.html',
				controller: AboutController
			})
			.state('words', {
				url: '/words',
				templateUrl: '/static/partials/word_index.html',
				controller: WordIndexController
			})
			.state('wordsshow', {
				url: '/words/{id}',
				templateUrl: '/static/partials/word_show.html',
				controller: WordShowController
			})
			.state('candidates', {
				url: '/candidates',
				templateUrl: '/static/partials/candidates.html',
				controller: CandidateController
			})
			.state('admin', {
				url: '/admin/{page}',
				templateUrl: '/static/partials/admin.html',
				controller: AdminController
			})
			.state('admindef', {
				url: '/admin',
				templateUrl: '/static/partials/admin.html',
				controller: AdminController
			})
			;

			$urlRouterProvider.otherwise('/');

			$locationProvider.html5Mode(true);
	}])
;