'use strict';

angular.module('angularFlaskServices', ['ngResource'])
	.factory('Post', function($resource) {
		return $resource('/api/post/:postId', {}, {
			query: {
				method: 'GET',
				params: { postId: '' },
				isArray: true
			}
		});
	})
	.factory('Word', function($resource) {
		return $resource('api/word/')
	})
	.factory('Candidate', function($resource) {
		return $resource('api/candidate/')
	})
;



