from app import app, models
from flask import render_template, flash, redirect
from .forms import DataAddForm

@app.route('/')
@app.route('/index')
def index():
    return 'world'

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
        models.word_search(form.filename.data)
    return render_template('add_file.html', title='add csv', form=form)