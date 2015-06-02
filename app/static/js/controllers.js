'use strict';

/* Controllers */

function IndexController($scope, $state, $filter, Search) {
	$scope.instructions = "위에서 단어를 검색하세요!";

    $scope.words = {};
	$scope.maxshow = 15;
    $scope.sort = "fresh_rate";
    $scope.search = function() {
        console.log({ word: parsed_letters, maxshow: $scope.maxshow, sort: $scope.sort });
        Search.save({ word: parsed_letters, maxshow: $scope.maxshow, sort: $scope.sort }, function(words) {
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
			return $filter('filter')(hl, {text: query});
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

    $scope.one = function() {
        $scope.sort = "fresh_rate";
        return $scope.search();
    }
    $scope.two = function() {
        $scope.sort = "rank_good";
        return $scope.search();
    }
    $scope.three = function() {
        $scope.sort = "rank_bad";
        return $scope.search();
    }
    $scope.four = function() {
        $scope.sort = "viewed";
        return $scope.search();
    }
}

function AboutController($scope) {
	
}

function WordIndexController($scope) {

}

function WordShowController($scope, Word, $stateParams, Update, ngDialog) {
	var wordQuery = Word.get({ id: $stateParams.id }, function(word) {
		$scope.word = word;
	});
	var refresh = function() {
		Word.get({ id: $stateParams.id }, function(word) { $scope.word = word; });
	}

    var voted = false;
	$scope.upvote = function(id) {
        if(voted) return;
        Update.save({ call_func: "word_upvote", obj: [ id ]}, function(response) {});
        voted = true;
        return refresh();
    }

	$scope.downvote = function(id) {
        if(voted) return;
        Update.save({ call_func: "word_downvote", obj: [ id ]}, function(response) {});
        voted = true;
        return refresh();
	}

    $scope.tags = [];
    function cutDownPart(raw_letters) {
        var key, tags_array, value;
        tags_array = [];
        if (raw_letters !== []) {
            for (key in raw_letters) {
                value = raw_letters[key];
                if(value["tag_string"] != null){
                    tags_array.push(value["tag_string"]);
                }
            }
        }
        return tags_array;
    }
    $scope.updateTags = function() {
        var param = [$scope.word.word_id].concat(cutDownPart($scope.tags));
		console.log({ call_func: "tag_insert", obj: param});
        Update.save({ call_func: "tag_insert", obj: param}, function(response) {});
        return refresh();
    }

    var tagvoted = false;
    $scope.tagupvote = function(id) {
        if(tagvoted) return;
		console.log({ call_func: "tag_upvote", obj: [ $scope.word.word_id, id ]});
        Update.save({ call_func: "tag_upvote", obj: [ $scope.word.word_id, id ]}, function(response) {});
        tagvoted = true;
        return refresh();
    }
    $scope.tagdownvote = function(id) {
        if(tagvoted) return;
        console.log({ call_func: "tag_downvote", obj: [ $scope.word.word_id, id ]});
        Update.save({ call_func: "tag_downvote", obj: [ $scope.word.word_id, id ]}, function(response) {});
        tagvoted = true;
        return refresh();
    }

	$scope.show = function() {
		ngDialog.openConfirm({ template: 'modal.html' }).then(function(value) {
			$scope.addReport(value);
			return refresh();
		}, function(reason) {});
	};

	$scope.report_detail = '';
	$scope.addReport = function(type) {
		console.log({ call_func: "report", obj: [ $scope.word.word_id, type[0], type[1] ] });
		Update.save({ call_func: "report", obj: [ $scope.word.word_id, type[0], type[1] ] }, function(response) {});
	}
}

function CandidateController($scope, Candidate, $stateParams, Update) {
    $scope.sort = "word_string";
    $scope.page = $stateParams.page;
    $scope.totalpages = 0;

    var candidateQuery = Candidate.get({ page: $stateParams.page, sort: $scope.sort }, function(candidate) {
    	$scope.candidates = candidate;
        $scope.totalpages = Math.ceil($scope.candidates.word_count / 15);
    });
	var refresh = function() {
		Candidate.get({ page: $stateParams.page, sort: $scope.sort }, function(candidate) { $scope.candidates = candidate; });
	}

    $scope.one = function() {
        $scope.sort = "word_id";
        return refresh();
    }
    $scope.two = function() {
        $scope.sort = "word_string";
        return refresh();
    }
    $scope.three = function() {
        $scope.sort = "vote";
        return refresh();
    }

    var voted = false;
    $scope.upvote = function(id) {
        if(voted) return;
		console.log({ call_func: "word_candidate_upvote", obj: [ id ]});
        Update.save({ call_func: "word_candidate_upvote", obj: [ id ]}, function(response) {});
        voted = true;
        return refresh();
    }

    $scope.downvote = function(id) {
        if(voted) return;
        Update.save({ call_func: "word_candidate_downvote", obj: [ id ]}, function(response) {});
        voted = true;
        return refresh();
    }

    $scope.wordstring = '';
    $scope.createCandidate = function() {
		console.log({ call_func: "word_candidate_insert", obj: [ $scope.wordstring ] });
        Update.save({ call_func: "word_candidate_insert", obj: [ $scope.wordstring ] }, function(response) {});
        return refresh();
    }
}

function AdminController($scope, Admin, $stateParams, Update) {
	$scope.recent = 0;
    $scope.page = $stateParams.page;
    $scope.totalpages = 0;

	var adminQuery = Admin.get({ page: $stateParams.page, recent: $scope.recent }, function(reports) {
		$scope.reports = reports;
		$scope.totalpages = Math.ceil($scope.reports.report_count / 15);
	});
	var refresh = function() {
		Admin.get({page: $stateParams.page, recent: $scope.recent}, function(reports) {$scope.reports = reports;});
	}

    $scope.one = function() {
        $scope.recent = 0;
        return refresh();
    }
    $scope.two = function() {
        $scope.recent = 1;
        return refresh();
    }

    $scope.deleteword = function(id) {
        Update.save({ call_func: "word_delete", obj: [id] }, function(response) {});
        return refresh();
    }
}
