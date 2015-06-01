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
		return $resource('/api/word', {}, {
			query: {
				method: 'GET',
				params: { id: '' }
			}
		});
	})
	.factory('Admin', function($resource) {
		return $resource('/api/admin', {}, {
			query: {
				method: 'GET',
				params: { page: 0, recent: 0 }
			}
		})
	})
	.factory('Candidate', function($resource) {
		return $resource('api/candidate/')
	})
;



