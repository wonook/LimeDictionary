# coding: utf-8
from app import db, redis_c
import os
import redis
import json
from datetime import date
from sqlalchemy.sql import text
from flask import jsonify


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

    def __init__(self, word_id):
        self.word_id = word_id
        self.vote = 0


class ReportLog(db.Model):
    report_id = db.Column(db.Integer, primary_key=True)
    word_id = db.Column(db.Integer, db.ForeignKey('word_all.word_id', ondelete='CASCADE'), nullable=False)
    report_type = db.Column(db.SmallInteger, db.ForeignKey('report_class.report_type'), nullable=False)
    report_detail = db.Column(db.String(80))

    def __init__(self, word_id, report_type, report_detail):
        self.word_id = word_id
        self.report_type = report_type
        self.report_detail = report_detail


class ReportClass(db.Model):
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
    elapsed_date = db.Column(db.Date, primary_key=True, nullable=False, autoincrement=False)
    rank_good = db.Column(db.Integer)
    rank_bad = db.Column(db.Integer)
    viewed = db.Column(db.Integer)
    point = db.Column(db.Integer)

    def __init__(self, word_id):
        self.word_id = word_id
        self.elapsed_date = date.today().isoformat()
        self.rank_bad = 0
        self.rank_good = 0
        self.viewed = 0
        self.point = 0


RAWQUERY = {
    'word_log_search': text('SELECT * FROM rank_log WHERE word_id = :word_id AND elapsed_date = :date'),
    'word_upvote': [text('UPDATE word_rank SET rank_good = rank_good + 1 WHERE word_id = :word_id'),
                    text('''UPDATE rank_log SET rank_good = rank_good + 1
                    WHERE word_id = :word_id and elapsed_date = :date''')],
    'word_downvote': [text('UPDATE word_rank SET rank_bad = rank_bad + 1 WHERE word_id = :word_id'),
                      text('''UPDATE rank_log SET rank_bad = rank_bad + 1
                      WHERE word_id = :word_id and elapsed_date = :date''')],
    'word_view': [text('UPDATE word_rank SET viewed = viewed + 1 WHERE word_id = :word_id'),
                  text('''UPDATE rank_log SET viewed = viewed + 1
                  WHERE word_id = :word_id and elapsed_date = :date''')],
    'word_search_DESC': text('''
    SELECT word_id, word_string, rank_good, rank_bad, viewed, fresh_rate
    FROM (word_search NATURAL JOIN word_all) NATURAL JOIN word_rank
    WHERE word_parsed REGEXP :word ORDER BY :column_name DESC
    '''),
    'word_search_ASC': text('''
    SELECT word_id, word_string, rank_good, rank_bad, viewed, fresh_rate
    FROM (word_search NATURAL JOIN word_all) NATURAL JOIN word_rank
    WHERE word_parsed REGEXP :word ORDER BY :column_name ASC
    '''),
    'get_word_id': text('''
    SELECT word_id
    FROM word_all
    WHERE word_string = :word_str
    '''),
    'get_word_data': text('''
    SELECT * FROM word_rank WHERE word_id = :word_id
    '''),
    'get_candidate_DESC': text('''
    SELECT word_id, word_string, vote
    FROM candidate_word NATURAL JOIN word_all
    ORDER BY :column_name DESC
    LIMIT :page_num, :fetch_num
    '''),
    'get_candidate_ASC': text('''
    SELECT word_id, word_string, vote
    FROM candidate_word NATURAL JOIN word_all
    ORDER BY :column_name ASC
    LIMIT :page_num, :fetch_num
    '''),
    'get_candidate_count': text('''
    SELECT count(*)
    FROM candidate_word
    '''),
    'get_cand_word_json':text('SELECT vote FROM word_candidate WHERE word_id = :word_id'),
    'get_report': text('''
    SELECT report_name, word_string, report_detail, word_id, reported
    FROM (report_log NATURAL JOIN report_class) NATURAL JOIN word_all
    ORDER BY :column_name DESC
    LIMIT :page_num, :fetch_num
    '''),
    'get_report_count': text('''
    SELECT count(*)
    FROM report_log
    '''),
    'word_candidate_upvote': text('UPDATE candidate_word SET vote = vote + 1 WHERE word_id = :word_id'),
    'word_candidate_downvote': text('UPDATE candidate_word SET vote = vote - 1 WHERE word_id = :word_id'),
    'word_candidate_move': text('DELETE FROM word_candidate WHERE word_id = :word_id'),
    'get_candidate_vote': text('SELECT vote FROM word_candidate WHERE word_id = :word_id'),
    'report': text('UPDATE word_all SET reported = reported + 1 WHERE word_id = :word_id'),
    'word_delete': text('DELETE FROM word_all WHERE word_id = :word_id'),
    'fresh_rate': [text('''
    UPDATE word_rank
    SET fresh_rate = (SELECT SUM(point) FROM rank_log
    WHERE word_rank.word_id = rank_log.word_id)'''),
                   text('''SELECT AVG(fresh_rate) FROM
                   (SELECT fresh_rate FROM word_rank ORDER BY fresh_rate DESC LIMIT (:top_n_count)) as top_fresh'''),
                   text('UPDATE word_rank SET fresh_rate = (100 * fresh_rate / (:top_rate))')],
    'elapse_time': [text('DELETE FROM rank_log WHERE DATEDIFF(CURRENT_DATE(), elapsed_date) >= 30'),
                    text('''
                    UPDATE rank_log
                    SET point = (DATEDIFF(CURRENT_DATE(), elapsed_date)) * (viewed + 10 * (rank_good + rank_bad))''')],
    'get_search_json': text('''
        SELECT word_id, word_string, rank_good, rank_bad, viewed, fresh_rate
        FROM (word_all NATURAL JOIN word_search) NATURAL JOIN word_rank
        WHERE (word_all.word_id IN (SELECT word_id FROM word_search AS search WHERE (search.word_parsed REGEXP :regex)))
        ORDER BY :column_name :desc
        LIMIT :start_index, :counts_per_page
        '''),
    'get_search_length': text('''
    SELECT count(*) FROM word_search WHERE word_parsed REGEXP :regex
    ''')
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
    middle = ((pos - last) // 28) % 21
    first = (((pos - last) // 28) - middle) // 21
    return JAMOPARSE[0][first] + JAMOPARSE[1][middle] + JAMOPARSE[2][last]


def parse_string(s):
    ret_val = ''
    for c in s:
        ret_val += parse_char(c)
    return ret_val


def parse_jlist(lst):
    if len(lst) == 0 or '?' in lst or '*' in lst:
        return '.'
    elif len(lst) == 1:
        return JAMOTABLE[lst[0]]
    ret_val = '['
    for c in [JAMOTABLE[x] for x in lst]:
        ret_val += c
    return ret_val + ']'


def parse_to_regex(jamo_tup):
    """
    :param jamo_tup:
        '성가대...' is in ['?', [['ㄱ','ㄴ'],['ㅏ'], ['X']], [['ㄷ'],['ㅐ','ㅏ'],['*']], '*']
    :return: regex string
    """
    if jamo_tup == [['*']] or jamo_tup == [] or jamo_tup == [[]]:
        return '.*'
    ret_val = '^'
    for tup in jamo_tup:
        if tup == ['?'] or tup == []:
            ret_val += '...'
            continue
        elif tup == ['*'] or tup == [['*']]:
            if ret_val == '^':
                ret_val = ''
                continue
            ret_val += '*'
            continue
        elif not isinstance(tup, list):
            ret_val += parse_char(tup)
            continue
        (fst, mid, lst) = (tup[0], tup[1], tup[2])
        ret = parse_jlist(fst) + parse_jlist(mid) + parse_jlist(lst)
        ret_val += ret

    ret_val += '$'
    return ret_val


def get_search_json(word_regex, page_num, fetch_num, column_name, desc=True):
    '''desc_text = 'DESC' if desc else 'ASC'
    counts_per_page = fetch_num if (fetch_num != 0) else 15
    order_column_name = column_name if (column_name != "") else 'word_string'
    start_index = counts_per_page * (page_num - 1)
    result = db.session.execute(RAWQUERY['get_search_json'],
                                regex=word_regex,
                                start_index=start_index,
                                column_name=order_column_name,
                                desc=desc_text,
                                counts_per_page=counts_per_page).fetchall()
    word_count는 regexp에 대응되는 전체 word의 갯수입니다. 아까처럼 하면 fetch_num과 같은 값이 나올것 같네요'''

    word_count = db.engine.execute(RAWQUERY['get_search_length'],
                                   regex=word_regex).scalar()
    ret_val = {
        'word_regex': word_regex,
        'word_count': word_count,
        'page_num': page_num,
        'dict': word_search(word_regex, page_num, fetch_num, column_name, desc)
    }
    return jsonify(ret_val)


def word_insert(word):
    db.session.add(WordAll(word))
    db.session.commit()


def word_candidate_insert(word):
    w = WordAll(word)
    db.session.add(w)
    db.session.commit()
    db.session.add(CandidateWord(w.word_id))
    db.session.commit()
    redis_c.set('id_' + str(w.word_id), word)


def word_candidate_move(word_id):
    db.session.add(WordSearch(word_id, parse_string(get_word(str(word_id)))))
    db.session.commit()
    db.session.add(WordRank(word_id))
    db.session.commit()
    db.engine.execute(RAWQUERY['word_candidate_move'], word_id=word_id)


def word_candidate_upvote(word_id):
    result = db.engine.execute(RAWQUERY['get_candidate_vote'], word_id=word_id).scalar()
    if result >= 4 : #5 이상이면 단어 등록
        word_candidate_move(word_id)
    else:
        db.engine.execute(RAWQUERY['word_candidate_upvote'], word_id=word_id)


def word_candidate_downvote(word_id):
    db.engine.execute(RAWQUERY['word_candidate_downvote'], word_id=word_id)


def word_search_insert(word):
    w = WordAll(word)
    db.session.add(w)
    db.session.commit()
    db.session.add(WordSearch(w.word_id, parse_string(word)))
    db.session.commit()
    db.session.add(WordRank(w.word_id))
    db.session.commit()
    redis_c.set('id_' + str(w.word_id), word)


def report(word_id, report_type, report_detail):
    db.session.add(ReportLog(word_id, report_type, report_detail))
    db.session.commit()
    db.engine.execute(RAWQUERY['report'], word_id=word_id)


def candidate_report(word_id, report_type, report_detail):
    report(word_id, report_type, report_detail)


def get_candidate_json(page_num, fetch_num, column_name, desc=True):
    desc_text = 'DESC' if desc else 'ASC'

    candidate_result = db.engine.execute(RAWQUERY['get_candidate_' + desc_text],
                                         column_name=column_name,
                                         page_num=(page_num - 1) * fetch_num,
                                         fetch_num=fetch_num)

    count_result = db.engine.execute(RAWQUERY['get_candidate_count']).scalar()
    candidate_data = {
        'word_count': count_result,
        'page_num': page_num
    }

    if count_result == 0:
        candidate_data['candidate_words'] = list()
        return jsonify(candidate_data)

    candidate_words = list()
    for row in candidate_result:
        candidate_words.append({
            'word_id': row[0],
            'word_string': row[1],
            'vote': row[2]
        })

    candidate_data['candidate_words'] = candidate_words

    return jsonify(candidate_data)


def get_admin_json(page_num, fetch_num, recent):
    column_name = 'reported' if recent == 0 else 'report_id'

    admin_result = db.engine.execute(RAWQUERY['get_report'],
                                     column_name=column_name,
                                     page_num=(page_num - 1) * fetch_num,
                                     fetch_num=fetch_num)
    count_result = db.engine.execute(RAWQUERY['get_report_count']).scalar()
    admin_data = {
        'report_count': count_result,
        'page_num': page_num
    }

    if count_result == 0:
        admin_data['report_words'] = list()
        return jsonify(admin_data)

    report_words = list()
    for row in admin_result:
        data = {
            'report_name': row[0],
            'word_string': row[1],
            'report_detail': row[2],
            'word_id': row[3]
        }
        report_words.append(data)

    admin_data['report_words'] = report_words
    return jsonify(admin_data)


def word_report(word_id, report_type, report_detail):
    report(word_id, report_type, report_detail)


def word_delete(word_id):
    db.engine.execute(RAWQUERY['word_delete'], word_id=word_id)
    redis_c.delete('id_' + str(word_id))


def word_log_search(word_id, datetoday):
    log = db.engine.execute(RAWQUERY['word_log_search'],
                            word_id=word_id,
                            date=datetoday).first()
    if log is None:
        db.session.add(RankLog(word_id))
        db.session.commit()


def word_upvote(word_id):
    datetoday = date.today().isoformat()
    db.engine.execute(RAWQUERY['word_upvote'][0], word_id=word_id)
    word_log_search(word_id, datetoday)
    db.engine.execute(RAWQUERY['word_upvote'][1], word_id=word_id, date=datetoday)


def word_downvote(word_id):
    datetoday = date.today().isoformat()
    db.engine.execute(RAWQUERY['word_downvote'][0], word_id=word_id)
    word_log_search(word_id, datetoday)
    db.engine.execute(RAWQUERY['word_downvote'][1], word_id=word_id, date=datetoday)


def word_view(word_id):
    datetoday = date.today().isoformat()
    db.engine.execute(RAWQUERY['word_view'][0], word_id=word_id)
    word_log_search(word_id, datetoday)
    db.engine.execute(RAWQUERY['word_view'][1], word_id=word_id, date=datetoday)


def word_search(word_regex, page_num, fetch_num, column_name, desc=True):
    desc_text = 'DESC' if desc else 'ASC'

    result = db.engine.execute(RAWQUERY['word_search_' + desc_text],
                               word=word_regex,
                               column_name=column_name)
    ret_val = list()
    i = 0
    for row in result.fetchall():
        ret_val.append({
            'word_id': row['word_id'],
            'word_string': row['word_string'],
            'rank_good': row['rank_good'],
            'rank_bad': row['rank_bad'],
            'viewed': row['viewed'],
            'fresh_rate': row['fresh_rate']
        })
        i += 1
        if i >= fetch_num:
            break
    return ret_val


def get_word(word_id_str):
    ret_val = redis_c.get('id_' + word_id_str)
    if ret_val is not None:
        return redis_c.get('id_' + word_id_str).decode('utf-8')
    else:
        return None


def get_word_id(word_str):
    result = db.engine.execute(RAWQUERY['get_word_id'], word_str=word_str).first()
    if result is None:
        return -1
    else:
        return result[0]


def get_word_data(word_id):
    result = db.engine.execute(RAWQUERY['get_word_data'], word_id=word_id).first()
    if result is None:
        return None
    word_data = {
        'word_id': word_id,
        'word_string': get_word(str(word_id)),
        'rank_good': result[1],
        'rank_bad': result[2],
        'viewed': result[3],
        'fresh_rate': result[4]
    }
    return word_data

def tag_list_insert(word_id, tag_list):
    is_len = False
    for tag in tag_list:
        if not is_len:
            is_len = True
            continue
        tag_id = get_word_id(tag)
        if tag_id != -1:
            tag_insert(word_id, tag_id)


def get_word_json(word_id, tag_count):
    word_data = get_word_data(word_id)
    if word_data is None:
        return jsonify(dict())
    tag = tag_fetch(word_id, tag_count)
    word_data['tag'] = tag
    return jsonify(word_data)

def get_cand_word_json(word_id):
    result = db.engine.execute(RAWQUERY['get_cand_word_json'], word_id=word_id).scalar()
    if result is None:
        return jsonify(dict())
    cand_data = {
        'word_id': word_id,
        'word_string': get_word(str(word_id)),
        'vote': result
    }
    return jsonify(cand_data)


def tag_insert(word_id, tag):
    if redis_c.zscore(word_id, tag) is None:
        redis_c.zadd(word_id, 1, tag)


def tag_upvote(word_id, tag):
    if redis_c.zscore(word_id, tag) is not None:
        redis_c.zincrby(word_id, tag)


def tag_downvote(word_id, tag):
    if redis_c.zscore(word_id, tag) is not None:
        redis_c.zincrby(word_id, tag, -1)


def tag_fetch(word_id, fetch_num):
    ret_val = list()
    for (tag_id, val) in redis_c.zrange(word_id, 0, fetch_num - 1, desc=True, withscores=True):
        ret_val.append({
            'tag_id': int(tag_id),
            'tag_string': get_word(str(int(tag_id))),
            'tag_rank': int(val)
        })
    return ret_val


def update_fresh_rate():
    top_n_count = 20

    db.engine.execute(RAWQUERY['fresh_rate'][0])  # 일단 포인트 합계를 넣어둠
    result = db.engine.execute(RAWQUERY['fresh_rate'][1],
                               top_n_count=top_n_count).scalar()  # 상위 top_n_count개의 포인트 합계의 평균을 추출
    db.engine.execute(RAWQUERY['fresh_rate'][2], top_rate=result)  # 추출한 평균을 기준으로 fresh_rate 업데이트



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
                print("duplicate {0}: {1}".format(type(e), e))
            i += 1
            if i > 100:
                i = 0
                j += 1
                print('{0}00th commit'.format(j))
    except IOError:
        print("could not open {0}".format(filename))
