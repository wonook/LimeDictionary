'use strict';

/* Controllers */

function IndexController($scope, $state, $filter, Search) {
	$scope.instructions = "위에서 단어를 검색하세요!";

    $scope.words = {};

	$scope.search = function() {
        var wordsQuery = Search.save({ word: parsed_letters }, function(words) {
        	$scope.words = words;
        });
		$state.go('home.search');
	}

	var getid = function() {
		return Math.random();
	}

	var header_letter = function() {
		return [
			{ id: getid(), text: '*' }, { id: getid(), text: 'ㄱ' }, { id: getid(), text: 'ㄲ' }, { id: getid(), text: 'ㄴ' }, { id: getid(), text: 'ㄷ' }, { id: getid(), text: 'ㄸ' }, { id: getid(), text: 'ㄹ' },
			{ id: getid(), text: 'ㅁ' }, { id: getid(), text: 'ㅂ' }, { id: getid(), text: 'ㅃ' }, { id: getid(), text: 'ㅅ' }, { id: getid(), text: 'ㅆ' }, { id: getid(), text: 'ㅇ' }, { id: getid(), text: 'ㅈ' },
			{ id: getid(), text: 'ㅉ' }, { id: getid(), text: 'ㅊ' }, { id: getid(), text: 'ㅋ' }, { id: getid(), text: 'ㅌ' }, { id: getid(), text: 'ㅍ' }, { id: getid(), text: 'ㅎ' }, { id: getid(), text: 'X' }
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
			if (query.trim() == '') return hl;
			return $filter('filter')(hl, {text: query}, function(actual, expected) { actual >= expected });
		} else if ($scope.whichLetter === 1) {
			if (query.trim() == '') return vl;
			return $filter('filter')(vl, {text: query});
		} else {
			if (query.trim() == '') return fl;
			return $filter('filter')(fl, {text: query});
		}
	}

	$scope.letters = [
		{ id: getid(), text: '글자1:' }
	];
	var prev = $scope.letters.slice();
	var buffer = [];
	var parsed_letters = [];

	Array.prototype.diff = function(a) {
		return this.filter(function(i) {return a.indexOf(i) < 0;});
	};

    function cutDownPart(raw_letters) {
        var key, tags_array, value;
        tags_array = [];
        if (raw_letters !== []) {
            for (key in raw_letters) {
                value = raw_letters[key];
                if(value["text"] != null){
                    tags_array.push(value["text"]);
                }
            }
        }
        return tags_array;
    }

	$scope.count = 1;
	$scope.nextLetter = function() {
		if($scope.whichLetter === 2) { //종성
			buffer.push(cutDownPart($scope.letters.diff(prev)));
			parsed_letters.push(buffer);
			buffer = [];
			console.log("parsed letters:", parsed_letters);
			$scope.count ++;
			$scope.letters.push({ id: getid(), text: '글자' + $scope.count + ':' });
			$scope.whichLetter = 0;
		}
		else { //초성/중성
			if($scope.letters[$scope.letters.length - 1].text == '*') {
				$scope.whichLetter = 2;
				$scope.nextLetter();
			} else {
				buffer.push(cutDownPart($scope.letters.diff(prev)));
				//console.log("buffer:", buffer);
				$scope.whichLetter++;
			}
		}
		updatemessage();
		prev = $scope.letters.slice();
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

function WordShowController($scope, Word, $stateParams) {
	var wordQuery = Word.get({ id: $stateParams.id }, function(word) {
		$scope.word = word;
	});

	$scope.upvote = function() {

	}

	$scope.downvote = function() {

	}

	$scope.updateTags = function() {

	}

    $scope.tags = [];
}

function CandidateController($scope, Candidate, $stateParams) {
    $scope.sort = "word_string";

    var candidateQuery = Candidate.get({ page: $stateParams.page, sort: $scope.sort }, function(candidate) {
    	$scope.candidates = candidate;
    });

    $scope.upvote = function() {

    }

    $scope.downvote = function() {

    }
}

function AdminController($scope, Admin, $stateParams) {
	$scope.recent = 0;

    var adminQuery = Admin.get({ page: $stateParams.page, recent: $scope.recent }, function(reports) {
        $scope.reports = reports;
    });
}

//function PostListController($scope, Post) {
//	var postsQuery = Post.get({}, function(posts) {
//		$scope.posts = posts.objects;
//	});
//}

