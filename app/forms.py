from flask.ext.wtf import Form
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired


class DataAddForm(Form):
    filename = StringField('filename', validators=[DataRequired()])


class DataLoadForm(Form):
    first = StringField('first', validators=[DataRequired()])
    second = StringField('second', validators=[DataRequired()])