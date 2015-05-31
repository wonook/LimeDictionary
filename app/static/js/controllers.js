'use strict';

/* Controllers */

function IndexController($scope) {
	$scope.instructions = "위에서 단어를 검색하세요!";

	$scope.search = function() {
		console.log($scope.searchQuery);
	}
}

function AboutController($scope) {
	
}

function PostListController($scope, Post) {
	var postsQuery = Post.get({}, function(posts) {
		$scope.posts = posts.objects;
	});
}

function PostDetailController($scope, $routeParams, Post) {
	var postQuery = Post.get({ postId: $routeParams.postId }, function(post) {
		$scope.post = post;
	});
}
