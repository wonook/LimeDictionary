'use strict';

angular.module('AngularFlask', ['angularFlaskServices', 'ui.router', 'ngTagsInput'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
		function($locationProvider, $stateProvider, $urlRouterProvider) {
			$stateProvider
            .state('about', {
                url: '/about',
                templateUrl: '/static/partials/about.html',
                controller: AboutController
            })
			.state('home', {
				url: '/',
				templateUrl: '/static/partials/landing.html',
				controller: IndexController
			})
			.state('home.search', {
				url: 'search',
				templateUrl: '/static/partials/word_index.html',
				controller: WordIndexController
			})
			.state('wordsshow', {
				url: '/words/{id}',
				templateUrl: '/static/partials/word_show.html',
				controller: WordShowController
			})
			.state('candidates', {
				url: '/candidates/{page}',
				templateUrl: '/static/partials/candidates.html',
				controller: CandidateController
			})
			.state('admin', {
				url: '/admin/{page}',
				templateUrl: '/static/partials/admin.html',
				controller: AdminController
			})
            .state('candidatesdef', {
                url: '/candidates',
                templateUrl: '/static/partials/candidates.html',
                controller: CandidateController
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