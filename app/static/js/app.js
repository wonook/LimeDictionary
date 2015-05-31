'use strict';

angular.module('AngularFlask', ['angularFlaskServices', 'ui.router', 'ngTagsInput'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
		function($locationProvider, $stateProvider, $urlRouterProvider) {
			$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'static/partials/landing.html',
				controller: IndexController
			})
			.state('about', {
				url: '/about',
				templateUrl: 'static/partials/about.html',
				controller: AboutController
			})
			.state('words', {
				url: '/words',
				templateUrl: 'static/partials/word_index.html',
				controller: WordIndexController
			})
			.state('words.show', {
				url: '/words/{id}',
				templateUrl: 'static/partials/word_show.html',
				controller: WordShowController
			})
			.state('candidates', {
				url: '/candidates',
				templateUrl: 'static/partials/candidates.html',
				controller: CandidateController
			})
			.state('post', {
				url: '/post',
				templateUrl: 'static/partials/post-list.html',
				controller: PostListController
			})
			.state('post.show', {
				url: '/post/:postId',
				templateUrl: '/static/partials/post-detail.html',
				controller: PostDetailController
			})
			/* Create a "/blog" route that takes the user to the same place as "/post" */
			.state('blog', {
				url: '/blog',
				templateUrl: 'static/partials/post-list.html',
				controller: PostListController
			})
			;

			$urlRouterProvider.otherwise('home');

			$locationProvider.html5Mode(true);
	}])
;