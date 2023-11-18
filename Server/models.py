from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
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
    password = db.Column(db.String(60))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    followers = db.relationship('Follower', back_populates='following', foreign_keys='Follower.following_id')
    following = db.relationship('Follower', back_populates='follower', foreign_keys='Follower.follower_id')
    comments = db.relationship('Comment', back_populates='user')
    posts = db.relationship('Post', back_populates='user')
    post_likes = db.relationship('PostLike', back_populates='user')
    comment_likes = db.relationship('CommentLike', back_populates='user')

    #* Instance methods *#
    def has_liked_post(self,id):
        return self.id in [like.user.id for like in db.session.get(Post, id).likes]

    def has_liked_comment(self,id):
        return self.id in [like.user.id for like in db.session.get(Comment, id).likes]
    
    #* Validations *#
    @validates('username')
    def username_validation(self, key, username):
        if username and (5 <= len(str(username)) <= 12):
            if re.match('^[a-zA-Z0-9_]+$', str(username)):
                return str(username)
            else:
                raise ValueError("Name can only contain letters, numbers, and underscores")
        else:
            raise ValueError("Username must be between 5 and 12 characters")
        
    @validates('password')
    def password_validation(self, key, password):
        if password and  5<= len(str(password)) <= 60:
            return password
        else:
            raise ValueError("Password must be longer than 5 characters and less than 60")
        
            


class Post(db.Model, SerializerMixin):
    #! One To Many Relationship Post -> PostLikes !#
    __tablename__ = 'posts'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.String(300))
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='posts')
    likes = db.relationship('PostLike', back_populates='post')
    
    #* Class methods *#
    @classmethod
    def get_likes_from_post(cls,id):
        return len([like for like in PostLike.query.all() if like.post.id == id])
    
    
class Comment(db.Model, SerializerMixin):
    #! One To Many Relationship Comment -> CommentLikes !#
    __tablename__ = 'comments'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    content = db.Column(db.String(300))
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='comments')
    likes = db.relationship('CommentLike', back_populates='comment')

    #* Class methods *#
    @classmethod
    def get_likes_from_comment(cls,id):
        return len([like for like in CommentLike.query.all() if like.comment.id == id])

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

class CommentLike(db.Model, SerializerMixin):
    __tablename__ = 'comment_likes'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='comment_likes')
    comment = db.relationship('Comment', back_populates='likes')

class PostLike(db.Model, SerializerMixin):
    __tablename__ = 'post_likes'

    #* sql rows *#
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    #* Relationships *#
    user = db.relationship('User', back_populates='post_likes')
    post = db.relationship('Post', back_populates='likes')
