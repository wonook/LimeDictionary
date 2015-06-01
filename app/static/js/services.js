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
		return $resource('http://www.kinetc.net:3000/api/word', {}, {
			query: {
				method: 'GET',
				params: { id: '' }
			}
		});
	})
	.factory('Candidate', function($resource) {
		return $resource('api/candidate/')
	})
;



