from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import redis

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
redis_c = redis.StrictRedis(host='localhost', port=6379, db=0)

from app import views, models
