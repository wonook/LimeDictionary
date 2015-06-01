from app import app, models
from flask import render_template, request, abort, jsonify
from .forms import DataAddForm
from flask import make_response
import urllib.parse

DESC_TABLE = {
    'id': False,
    'word_id': False,
    'word_string': False,
    'fresh_rate': True,
    'rank_good': True,
    'rank_bad': True,
    'viewed': True,
    'vote': True,
    'report': True
}


@app.route('/')
@app.route('/index')
@app.route('/home')
@app.route('/words')
@app.route('/words/<int:asdf>')
@app.route('/admin')
@app.route('/admin/<int:asdf>')
@app.route('/candidates')
@app.route('/candidates/<int:asdf>')
@app.route('/search')
@app.route('/about')
def index(**kwargs):
    return make_response(open('app/templates/index.html').read())


@app.route('/add_data', methods=['GET', 'POST'])
def add_data():
    form = DataAddForm()
    if form.validate_on_submit():
        models.open_save_file(form.filename.data)
        # flash('filename = %s' % form.filename.data)
    return render_template('add_file.html', title='add csv', form=form)


@app.route('/read_data', methods=['GET', 'POST'])
def read_data():
    form = DataAddForm()
    if form.validate_on_submit():
        models.word_search(models.parse_string(form.filename.data), 0, 14, 'fresh_rate')
    return render_template('add_file.html', title='read csv', form=form)


@app.route('/redis', methods=['GET', 'POST'])
def redis_add():
    form = DataAddForm()
    if form.validate_on_submit():
        rrr = int(form.filename.data)
        if rrr == -1:
            models.elapse_time()
        elif rrr == -2:
            models.update_fresh_rate()
    return render_template('add_file.html', title='add redis', form=form)


@app.route('/api/result', methods=['GET'])
def result_json():
    word_regex = urllib.parse.unquote(request.args.get('word'))
    page_num = request.args.get('page')
    page_num = 1 if page_num is None else int(page_num)
    column_name = request.args.get('sort')
    column_name = 'word_string' if column_name is None else column_name
    return models.get_search_json(word_regex, page_num, 15,
                                  column_name, DESC_TABLE[column_name])


@app.route('/api/admin', methods=['GET'])
def admin_json():
    page_num = request.args.get('page')
    page_num = 1 if page_num is None else int(page_num)
    recent = request.args.get('recent')
    recent = 0 if recent is None else recent
    return models.get_admin_json(page_num, 15, int(recent))


@app.route('/api/search', methods=['POST'])
def search_json():
    if not request.json or 'word' not in request.json:
        abort(400)
    word_regex = models.parse_to_regex(request.json['word'])
    page_num = 1 if 'page' not in request.json else request.json['page']
    column_name = 'word_string' if 'sort' not in request.json else request.json['sort']
    fetch_num = 15 if 'maxshow' not in request.json else request.json['maxshow']
    return models.get_search_json(word_regex, page_num, fetch_num,
                                  column_name, DESC_TABLE[column_name])


@app.route('/api/word', methods=['GET'])
def word_json():
    word_id = int(request.args.get('id'))
    models.word_view(word_id)
    return models.get_word_json(word_id, 15)


@app.route('/api/candidate', methods=['GET'])
def candidate_json():
    page_num = request.args.get('page')
    page_num = 1 if page_num is None else int(page_num)
    column_name = request.args.get('sort')
    column_name = 'word_string' if column_name is None else column_name
    return models.get_candidate_json(page_num, 15,
                                     column_name, DESC_TABLE[column_name])


@app.route('/api/update', methods=['POST'])
def update_json():
    if not request.json or 'call_func' not in request.json:
        abort(400)

    call_func = request.json['call_func']
    obj = None if 'obj' not in request.json else request.json['obj']

    if call_func == 'word_candidate_insert':
        models.word_candidate_insert(obj[0])
    elif call_func == 'word_candidate_upvote':
        models.word_candidate_upvote(int(obj[0]))
    elif call_func == 'word_candidate_downvote':
        models.word_candidate_downvote(int(obj[0]))
    elif call_func == 'word_search_insert':
        models.word_search_insert(obj[0])
    elif call_func == 'report':
        models.report(int(obj[0]),
                      int(obj[1]),
                      obj[2])
    elif call_func == 'candidate_report':
        models.candidate_report(int(obj[0]),
                                int(obj[1]),
                                obj[2])
    elif call_func == 'word_report':
        models.word_report(int(obj[0]),
                           int(obj[1]),
                           obj[2])
    elif call_func == 'word_delete':
        models.word_delete(int(obj[0]))
    elif call_func == 'word_upvote':
        models.word_upvote(int(obj[0]))
    elif call_func == 'word_downvote':
        models.word_downvote(int(obj[0]))
    elif call_func == 'tag_insert':
        models.tag_list_insert(int(obj[0]), obj)
    elif call_func == 'tag_upvote':
        models.tag_upvote(int(obj[0]),
                          int(obj[1]))
    elif call_func == 'tag_downvote':
        models.tag_downvote(int(obj[0]),
                            int(obj[1]))
    elif call_func == 'update_fresh_rate':
        models.update_fresh_rate()
    elif call_func == 'elapse_time':
        models.elapse_time()

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)
