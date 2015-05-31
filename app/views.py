from app import app, models
from flask import render_template, flash, redirect, request
from .forms import DataAddForm
from flask import make_response



@app.route('/')
@app.route('/index')
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
        partdata = form.filename.data.partition(',')
        models.tag_fetch(partdata[0], int(partdata[2]))
    return render_template('add_file.html', title='add redis', form=form)

@app.route('/api/result', methods=['GET'])
def result_json():
    pass

@app.route('/api/admin', methods=['GET'])
def admin_json():
    pass

@app.route('/api/search', methods=['POST'])
def search_json():
    pass

@app.route('/api/word/<int:word_id>', methods=['GET'])
def word_json(word_id):
    # word_id = request.args.get('id')
    return models.get_word_json(word_id, 5)

@app.route('/api/candidate', methods=['GET'])
def candidate_json():
    pass