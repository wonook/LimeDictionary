from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager
import redis

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
redis_c = redis.StrictRedis(host='localhost', port=6379, db=0)
api_manager = APIManager(app, flask_sqlalchemy_db=db)
from app import views, models
