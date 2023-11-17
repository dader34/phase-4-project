from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'

#? class Message(db.Model, SerializerMixin):
#?  pass

#? class Chat(db.Model, SerializerMixin):
#?  pass