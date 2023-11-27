from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
import bcrypt
import re

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(12), unique=True)
    #! Max Lenth of password should be around 15 but bcrypt may make it longer
    #! Solution: Just check if password is greater than 15 on signup rooute, and have database max be higher so it account for bcrypt
    _password_hash = db.Column(db.String(75))
    #* https://backend.danner.repl.co/ *#
    #* Make post here on frontend signup then get response and send back to backend in post req to create user (signup) *#
    profile_picture = db.Column(db.String(500), default='https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg')
    user_bio = db.Column(db.String(300), default="My bio")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    followers = db.relationship('Follower', back_populates='following', foreign_keys='Follower.following_id', cascade='all, delete-orphan')
    following = db.relationship('Follower', back_populates='follower', foreign_keys='Follower.follower_id', cascade='all, delete-orphan')
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')
    post_likes = db.relationship('PostLike', back_populates='user', cascade='all, delete-orphan')
    
    @hybrid_property
    def password(self):
        raise AttributeError('No looking at the password')

    @password.setter
    def password(self, password):
        if password and  5<= len(str(password)) <= 75:
            self._password_hash = bcrypt.hashpw(password=password.encode('utf-8'),salt=bcrypt.gensalt())
        else:
            raise ValueError('Password must be longer than 5 characters and less than 75')
       

    def authenticate(self,password):
        return bcrypt.checkpw(password.encode('utf-8'),self._password_hash)



    #* Validations *#
    @validates('username')
    def username_validation(self, key, username):
        if username and (5 <= len(str(username)) <= 12):
            if re.match('^[a-zA-Z0-9_]+$', str(username)):
                return str(username)
            else:
                raise ValueError('Name can only contain letters, numbers, and underscores')
        else:
            raise ValueError('Username must be between 5 and 12 characters')
        
        
            

#TODO: Figure Out How To Serialize Posts. -(comments,parent,user,post_likes)
class Post(db.Model, SerializerMixin):
    #! One To Many Relationship Post -> PostLikes !#
    __tablename__ = 'posts'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.String(300))
    #Stretch goal, upload images
    parent_post = db.Column(db.Integer, db.ForeignKey("posts.id"))
    views = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='posts')
    comments = db.relationship('Post', back_populates='parent', cascade='all, delete-orphan')
    parent = db.relationship('Post', back_populates='comments', remote_side=[id])
    #! post_likes represents all of the post likes, and likes represents the respective users !#
    post_likes = db.relationship('PostLike', back_populates='post', cascade='all, delete-orphan')
    likes = association_proxy("post_likes","user")

    #* Serialization Rules *#
    serialize_only = ('id','user_id','content','parent_post','created_at','user.id','user.username','comments.id','likes.username','likes.id','user.profile_picture','views')
    
    #* Validations *#
    @validates('user_id')
    def user_id_validation(self, key, user_id):
        if user_id and db.session.get(User, user_id):
            return user_id
        else:
            raise ValueError('User id must be a valid user')
        
    @validates('content')
    def content_validation(self, key, content):
        if content and (1 <= len(content) <= 300):
            return content
        else:
            raise ValueError('Content must be between 1 and 300 chars and not empty')
        

class Follower(db.Model, SerializerMixin):
    #! Many to Many Relationship !#
    #! User submittable attribute: Close Friend: Bool #!
    __tablename__ = 'followers'

    #* sql rows
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    close_friend = db.Column(db.Boolean, default=False)

    #* Relationships *#
    follower = db.relationship('User', back_populates='followers', foreign_keys=[follower_id])
    following = db.relationship('User', back_populates='following', foreign_keys=[following_id])

    #* Validations *#
    @validates('follower_id')
    def follower_id_validation(self, key, follower_id):
        if follower_id and db.session.get(User, follower_id):
            return follower_id
        else:
            raise ValueError('User id must be a valid user')
    
    @validates('following_id')
    def following_id_validation(self, key, following_id):
        if following_id and db.session.get(User, following_id):
            return following_id
        else:
            raise ValueError('User id must be a valid user')
    
    @validates('close_friend')
    def close_friend_validation(self, key, close_friend):
        if (close_friend is not None) and isinstance(close_friend, bool):
            return close_friend
        else:
            raise ValueError('close_friend must be a boolean')


class PostLike(db.Model, SerializerMixin):
    __tablename__ = 'post_likes'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='post_likes')
    post = db.relationship('Post', back_populates='post_likes')

    #* Validations *#
    @validates('user_id')
    def user_id_validation(self, key, user_id):
        if user_id and db.session.get(User, user_id):
            return user_id
        else:
            raise ValueError('User id must be a valid user')
        
    @validates('post_id')
    def post_id_validation(self, key, post_id):
        if post_id and db.session.get(Post, post_id):
            return post_id
        else:
            raise ValueError('Post id must be a valid post')