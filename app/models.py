from app import db
import os
from sqlalchemy.sql import text

class WordAll(db.Model):
    word_id = db.Column(db.Integer, primary_key=True)
    word_string = db.Column(db.String(8), nullable=False, unique=True)
    reported = db.Column(db.SmallInteger)

    def __init__(self, word_string):
        self.word_string = word_string
        self.reported = 0


class WordSearch(db.Model):
    word_id = db.Column(db.Integer, db.ForeignKey('word_all.word_id', ondelete='CASCADE'), primary_key=True)
    word_parsed = db.Column(db.String(24), nullable=False)

    def __init__(self, word_id, word_parsed):
        self.word_id = word_id
        self.word_parsed = word_parsed

class CandidateWord(db.Model):
    word_id = db.Column(db.Integer, db.ForeignKey('word_all.word_id', ondelete='CASCADE'), primary_key=True)
    vote = db.Column(db.Integer)


class ReportLog(db.Model):
    word_id = db.Column(db.Integer, db.ForeignKey('word_all.word_id', ondelete='CASCADE'), primary_key=True)
    report_type = db.Column(db.SmallInteger, db.ForeignKey('report_type.report_type'), nullable=False)
    report_detail = db.Column(db.String(80))

    def __init__(self, word_id, report_type, report_detail):
        self.word_id = word_id
        self.report_type = report_type
        self.report_detail = report_detail


class ReportType(db.Model):
    report_type = db.Column(db.SmallInteger, primary_key=True)
    report_name = db.Column(db.String(24))


class WordRank(db.Model):
    word_id = db.Column(db.Integer, db.ForeignKey('word_search.word_id', ondelete='CASCADE'), primary_key=True)
    rank_good = db.Column(db.Integer)
    rank_bad = db.Column(db.Integer)
    viewed = db.Column(db.Integer)
    fresh_rate = db.Column(db.Integer)

    def __init__(self, word_id):
        self.word_id = word_id
        self.rank_good = 0
        self.rank_bad = 0
        self.viewed = 0
        self.fresh_rate = 0


class RankLog(db.Model):
    word_id = db.Column(db.Integer, db.ForeignKey('word_search.word_id', ondelete='CASCADE'), primary_key=True)
    elapsed_date = db.Column(db.SmallInteger, primary_key=True)
    rank_good = db.Column(db.Integer)
    rank_bad = db.Column(db.Integer)
    viewed = db.Column(db.Integer)

    def __init__(self, word_id):
        self.word_id = word_id
        self.elapsed_date = 0
        self.rank_bad = 0
        self.rank_good = 0
        self.viewed = 0


RAWQUERY = {
    'word_upvote': [text('UPDATE word_rank SET rank_good = rank_good + 1 WHERE word_id = :word_id'),
                    text('UPDATE rank_log SET rank_good = rank_good + 1 WHERE word_id = :word_id and elapsed_date = 0')],
    'word_downvote': [text('UPDATE word_rank SET rank_bad = rank_bad + 1 WHERE word_id = :word_id'),
                      text('UPDATE rank_log SET rank_bad = rank_bad + 1 WHERE word_id = :word_id and elapsed_date = 0')],
    'word_view': [text('UPDATE word_rank SET viewed = viewed + 1 WHERE word_id = :word_id'),
                  text('UPDATE rank_log SET viewed = viewed + 1 WHERE word_id = :word_id and elapsed_date = 0')],
    'word_search': text('SELECT word_string from word_all WHERE word_string = :word'),
    'report': text('UPDATE word_all SET reported = reported + 1 WHERE word_id = :word_id'),
    'word_delete': text('DELETE FROM word_all WHERE word_id = :word_id'),
    'fresh_rate': text('''
    WITH fresh_raw(word_id, rate) as
    (
        SELECT word_id, (30 - elapsed_date) * (viewed + 10 * (rank_good + rank_bad))
        FROM rank_log
    ), max_rate(val) as (SELECT max(rate) FROM fresh_raw)
    UPDATE word_rank SET fresh_rate =
    (
        SELECT 100 * fresh_raw.rate / max_rate.val
        FROM fresh_raw, max_rate
        WHERE word_rank.word_id = fresh_raw.word_id
    )
    '''),
    'elapse_time': [text('UPDATE rank_log SET elapsed_date = elapsed_date + 1'),
                    text('DELETE FROM word_all WHERE elapsed_date >= 30')]
}
JAMOTABLE = {
    'ㄱ': '0', 'ㄴ': '1', 'ㄷ': '2', 'ㄹ': '3', 'ㅁ': '4', 'ㅂ': '5', 'ㅅ': '6', 'ㅇ': '7', 'ㅈ': '8', 'ㅊ': '9',
    'ㅋ': 'a', 'ㅌ': 'b', 'ㅍ': 'c', 'ㅎ': 'd', 'ㄲ': 'e', 'ㅆ': 'f', 'ㅃ': 'g', 'ㄸ': 'h', 'ㅉ': 'i', 'ㄳ': 'j',
    'ㄵ': 'k', 'ㄶ': 'l', 'ㄺ': 'm', 'ㄻ': 'n', 'ㄼ': 'o', 'ㄽ': 'p', 'ㄾ': 'q', 'ㄿ': 'r', 'ㅀ': 's', 'ㅄ': 't',
    'ㅏ': 'A', 'ㅑ': 'B', 'ㅓ': 'C', 'ㅕ': 'D', 'ㅗ': 'E', 'ㅛ': 'F', 'ㅜ': 'G', 'ㅠ': 'H', 'ㅡ': 'I', 'ㅣ': 'J',
    'ㅐ': 'K', 'ㅒ': 'L', 'ㅔ': 'M', 'ㅖ': 'N', 'ㅘ': 'O', 'ㅙ': 'P', 'ㅚ': 'Q', 'ㅝ': 'R', 'ㅞ': 'S', 'ㅟ': 'T',
    'ㅢ': 'U', 'X': 'V'
}
JAMOPARSE = [
    [JAMOTABLE[x] for x in ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ",
                            "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", 'X']],
    [JAMOTABLE[x] for x in ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ",
                            "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ", 'X']],
    [JAMOTABLE[x] for x in ["X", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
                            "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]]
]

def parse_char(c):
    pos = ord(c) - 0xac00
    last = pos % 28
    middle = ((pos-last)//28) % 21
    first = (((pos-last)//28)-middle)//21
    return JAMOPARSE[0][first] + JAMOPARSE[1][middle] + JAMOPARSE[2][last]

def parse_string(s):
    ret_val = ''
    for c in s:
        ret_val += parse_char(c)
    return ret_val

def word_insert(word):
    db.session.add(WordAll(word))
    db.session.commit()

def word_candidate_insert(word):
    pass

def word_candidate_move(word_id):
    pass

def word_search_insert(word):
    w = WordAll(word)
    db.session.add(w)
    db.session.commit()
    db.session.add(WordSearch(w.word_id, parse_string(word)))
    db.session.add(WordRank(w.word_id))
    db.session.commit()

def report(word_id, report_type, report_detail):
    db.session.add(ReportLog(word_id, report_type, report_detail))
    db.session.commit()
    db.engine.execute(RAWQUERY['report'], word_id=word_id)

def candidate_report(word_id, report_type, report_detail):
    report(word_id, report_type, report_detail)

def word_report(word_id, report_type, report_detail):
    report(word_id, report_type, report_detail)

def word_delete(word_id):
    db.engine.execute(RAWQUERY['word_delete'], word_id=word_id)

def word_upvote(word_id):
    db.engine.execute(RAWQUERY['word_upvote'][0], word_id=word_id)
    db.engine.execute(RAWQUERY['word_upvote'][1], word_id=word_id)

def word_downvote(word_id):
    db.engine.execute(RAWQUERY['word_downvote'][0], word_id=word_id)
    db.engine.execute(RAWQUERY['word_downvote'][1], word_id=word_id)

def word_view(word_id):
    db.engine.execute(RAWQUERY['word_view'][0], word_id=word_id)
    db.engine.execute(RAWQUERY['word_view'][1], word_id=word_id)

def word_search(word_regex):
    result = db.engine.execute(RAWQUERY['word_search'], word=word_regex)
    for word in result.fetchmany(10):
        print(word)

def tag_insert(word_id, tag):
    pass

def tag_upvote(word_id, tag):
    pass

def tag_downvote(word_id, tag):
    pass

def tag_view(word_id, fetch_num):
    pass

def update_fresh_rate():
    db.engine.execute(RAWQUERY['fresh_rate'])

def elapse_time():
    db.engine.execute(RAWQUERY['elapse_time'][0])
    db.engine.execute(RAWQUERY['elapse_time'][1])


def open_save_file(filename):
    try:
        f = open(os.path.join('app', 'static', filename + '.csv'), 'r')
        i = 0
        j = 0
        for line in f:
            try:
                w = line.partition(',')[0]
                word_search_insert(w)
            except Exception as e:
                print("duplicate ", type(e))
            i += 1
            if i > 100:
                i = 0
                j += 1
                print('{0}00th commit'.format(j))
    except IOError:
        print("could not open {0}".format(filename))