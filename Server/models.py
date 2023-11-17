from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class Post(db.Model, SerializerMixin):
    pass

class User(db.Model, SerializerMixin):
    pass

class Comment(db.Model, SerializerMixin):
    pass

#? class Message(db.Model, SerializerMixin):
#?  pass

#? class Chat(db.Model, SerializerMixin):
#?  pass