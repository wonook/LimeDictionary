'use strict';

/* Controllers */

function IndexController($scope, $state, $filter) {
	$scope.instructions = "위에서 단어를 검색하세요!";

	$scope.search = function() {
		console.log($scope.searchQuery);
		$state.go('words');
	}

	var getid = function() {
		return Math.random();
	}

	var header_letter = function() {
		return [
			{ id: getid(), text: 'ㄱ' }, { id: getid(), text: 'ㄲ' }, { id: getid(), text: 'ㄴ' }, { id: getid(), text: 'ㄷ' }, { id: getid(), text: 'ㄸ' }, { id: getid(), text: 'ㄹ' }, { id: getid(), text: 'ㅁ' },
			{ id: getid(), text: 'ㅂ' }, { id: getid(), text: 'ㅃ' }, { id: getid(), text: 'ㅅ' }, { id: getid(), text: 'ㅆ' }, { id: getid(), text: 'ㅇ' }, { id: getid(), text: 'ㅈ' }, { id: getid(), text: 'ㅉ' },
			{ id: getid(), text: 'ㅊ' }, { id: getid(), text: 'ㅋ' }, { id: getid(), text: 'ㅌ' }, { id: getid(), text: 'ㅍ' }, { id: getid(), text: 'ㅎ' }, { id: getid(), text: 'X' }
		];
	}
	var hl = header_letter();

	var vowel_letter = function() {
		return [
			{ id: getid(), text: 'ㅏ' }, { id: getid(), text: 'ㅐ' }, { id: getid(), text: 'ㅑ' }, { id: getid(), text: 'ㅒ' }, { id: getid(), text: 'ㅓ' }, { id: getid(), text: 'ㅔ' }, { id: getid(), text: 'ㅕ' },
			{ id: getid(), text: 'ㅖ' }, { id: getid(), text: 'ㅗ' }, { id: getid(), text: 'ㅘ' }, { id: getid(), text: 'ㅙ' }, { id: getid(), text: 'ㅚ' }, { id: getid(), text: 'ㅛ' }, { id: getid(), text: 'ㅜ' },
			{ id: getid(), text: 'ㅝ' }, { id: getid(), text: 'ㅞ' }, { id: getid(), text: 'ㅟ' }, { id: getid(), text: 'ㅠ' }, { id: getid(), text: 'ㅡ' }, { id: getid(), text: 'ㅢ' }, { id: getid(), text: 'ㅣ' }, { id: getid(), text: 'X' }
		];
	}
	var vl = vowel_letter();

	var footer_letter = function() {
		return [
			{ id: getid(), text: 'X' }, { id: getid(), text: 'ㄱ' }, { id: getid(), text: 'ㄲ' }, { id: getid(), text: 'ㄳ' }, { id: getid(), text: 'ㄴ' }, { id: getid(), text: 'ㄵ' }, { id: getid(), text: 'ㄶ' },
			{ id: getid(), text: 'ㄷ' }, { id: getid(), text: 'ㄹ' }, { id: getid(), text: 'ㄺ' }, { id: getid(), text: 'ㄻ' }, { id: getid(), text: 'ㄼ' }, { id: getid(), text: 'ㄽ' }, { id: getid(), text: 'ㄾ' },
			{ id: getid(), text: 'ㄿ' }, { id: getid(), text: 'ㅀ' }, { id: getid(), text: 'ㅁ' }, { id: getid(), text: 'ㅂ' }, { id: getid(), text: 'ㅄ' }, { id: getid(), text: 'ㅅ' }, { id: getid(), text: 'ㅆ' },
			{ id: getid(), text: 'ㅇ' }, { id: getid(), text: 'ㅈ' }, { id: getid(), text: 'ㅊ' }, { id: getid(), text: 'ㅋ' }, { id: getid(), text: 'ㅌ' }, { id: getid(), text: 'ㅍ' }, { id: getid(), text: 'ㅎ' }
		];
	}
	var fl = footer_letter();
	$scope.loadLetters = function(query) {
		if($scope.whichLetter === 0) {
			if (query == ' ') return hl;
			return $filter('filter')(vl, {text: query});
		} else if ($scope.whichLetter === 1) {
			if (query == ' ') return vl;
			return $filter('filter')(vl, {text: query});
		} else {
			if (query == ' ') return fl;
			return $filter('filter')(fl, {text: query});
		}
	}

	$scope.letters = [
		{ id: getid(), text: '글자1:' }
	];

	$scope.count = 1;
	$scope.nextLetter = function() {
		if($scope.whichLetter === 2) {
			$scope.count ++;
			$scope.letters.push({ id: getid(), text: '글자' + $scope.count + ':' });
			$scope.whichLetter = 0;
		}
		else {
			$scope.whichLetter++;
		}
		updatemessage();
		return;
	}

	$scope.placeholder = '글자' + $scope.count +'의 초성(자음)을 입력하세요';
	$scope.placeholder2 = '초성 입력 완료';
	var updatemessage = function() {
		hl = header_letter();
		vl = vowel_letter();
		fl = footer_letter();
		if($scope.whichLetter === 0) {
			$scope.placeholder = '글자' + $scope.count +'의 초성(자음)을 입력하세요';
			$scope.placeholder2 = '초성 입력 완료';
		} else if($scope.whichLetter === 1) {
			$scope.placeholder = '글자' + $scope.count +'의 중성(모음)을 입력하세요';
			$scope.placeholder2 = '중성 입력 완료';
		} else {
			$scope.placeholder = '글자' + $scope.count +'의 종성(자음)을 입력하세요';
			$scope.placeholder2 = '종성 입력 완료';
		}
		return;
	}
}

function AboutController($scope) {
	
}

function WordIndexController($scope) {

}

function WordShowController($scope) {

}

function CandidateController($scope) {

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
