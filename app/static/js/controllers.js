'use strict';

/* Controllers */

function IndexController($scope, $state, $filter, Search) {
	$scope.instructions = "위에서 단어를 검색하세요!";

    $scope.words = {};

	$scope.search = function() {
        //var wordsQuery = Search.save({ word: parsed_letters }, function(words) {
        //	$scope.words = words;
        //});
        $scope.words = {
            "dict": [
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 9,
                    "word_id": 3,
                    "word_string": "\uac00\uae5d\ub514\uac00\uae5d"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 1,
                    "word_id": 4,
                    "word_string": "\uac00\ub0d0\ud504"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 5,
                    "word_string": "\uac00\ub0d8\ud504"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 6,
                    "word_string": "\uac00\ub140\ub9ac"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 7,
                    "word_string": "\uac00\ub290\ub2e4\ub797"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 8,
                    "word_string": "\uac00\ub290\ub2ff"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 9,
                    "word_string": "\uac00\ub290\ub797"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 10,
                    "word_string": "\uac00\ub298"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 11,
                    "word_string": "\uac00\ub298\ub514\uac00\ub298"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 12,
                    "word_string": "\uac00\ub2d0"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 13,
                    "word_string": "\uac00\ub2f9\ucc2e"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 1,
                    "word_id": 14,
                    "word_string": "\uac00\ub4dd\ucc28"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 15,
                    "word_string": "\uac00\ub78d"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 16,
                    "word_string": "\uac00\ub7c9\uc2a4\ub7fd"
                },
                {
                    "fresh_rate": 0,
                    "rank_bad": 0,
                    "rank_good": 0,
                    "viewed": 0,
                    "word_id": 17,
                    "word_string": "\uac00\ub7c9\uc5c6"
                }
            ],
            "word_count": 2208,
            "word_regex": "......$"
        }
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
			if (query == ' ') return hl;
			return $filter('filter')(vl, {text: query}, function(actual, expected) { actual >= expected });
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
	//var wordQuery = Word.get({ id: $stateParams.id }, function(word) {
	//	$scope.word = word;
	//});

	$scope.upvote = function() {

	}

	$scope.downvote = function() {

	}

	$scope.updateTags = function() {

	}

	$scope.word = {
		fresh_rate: 0,
		rank_bad: 0,
		rank_good: 0,
		tag: [ ],
		viewed: 6,
		word_id: 2,
		word_string: "가깝"
	}
}

function CandidateController($scope, Candidate) {
    $scope.sort = "word_string";

    //var candidateQuery = Candidate.get({ page: $stateParams.page, sort: $scope.sort }, function(candidate) {
    //	$scope.candidates = candidate;
    //})

    $scope.candidates = {
        candidate_words: [
            {vote: 0,
                word_id: 2361,
                word_string: "흐하하하"
            },
            {
                vote: 0,
                word_id: 2362,
                word_string: "흐하하"
            },
            {
                vote: 0,
                word_id: 2363,
                word_string: "사과나무밥"
            },
            {
                vote: 0,
                word_id: 2364,
                word_string: "로피탈"
            },
            {
                vote: 0,
                word_id: 2365,
                word_string: "전전회"
            },
            {
                vote: 0,
                word_id: 2366,
                word_string: "컴공세"
            }
        ],
        word_count: 6
    }
}

function AdminController($scope, Admin) {
	$scope.recent = 0;

	//var adminQuery = Admin.get({ page: $stateParams.page, recent = $scope.recent }, function(admin) {
	//	$scope.reports = admin;
	//})

	$scope.reports = {
		report_count: 0,
		report_words: [ ]
	};
}

//function PostListController($scope, Post) {
//	var postsQuery = Post.get({}, function(posts) {
//		$scope.posts = posts.objects;
//	});
//}

