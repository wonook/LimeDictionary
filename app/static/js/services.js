'use strict';

angular.module('angularFlaskServices', ['ngResource'])
	.factory('Word', function($resource) {
		return $resource('/api/word', {}, {
			query: {
				method: 'GET',
				params: { id: '' }
			}
		});
	})
    .factory('Search', function($resource) {
        return $resource('/api/search', {}, {
            query: {
                method: 'POST',
                params: { word: [], maxshow: 15, sort: "fresh_rate" }
            }
        })
    })
    .factory('Candidate', function($resource) {
        return $resource('/api/candidate', {}, {
            query: {
                method: 'GET',
                params: { page: 1, sort: "word_string" }
            }
        })
    })
	.factory('Admin', function($resource) {
		return $resource('/api/admin', {}, {
			query: {
				method: 'GET',
				params: { page: 1, recent: 0 }
			}
		})
	})
    .factory('Update', function($resource) {
        return $resource('/api/update', {}, {
            query: {
                method: 'POST',
                params: { call_func: "", obj: [] }
            }
        })
    })
;



