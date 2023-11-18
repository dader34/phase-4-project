from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(12), unique=True)
    password = db.Column(db.String(40))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    #* Relationships *#
    followers = db.relationship('Follower', back_populates='following', foreign_keys='Follower.following_id')
    following = db.relationship('Follower', back_populates='follower', foreign_keys='Follower.follower_id')
    comments = db.relationship('Comment', back_populates='user')
    posts = db.relationship('Post', back_populates='user')
    post_likes = db.relationship('PostLike', back_populates='user')
    comment_likes = db.relationship('CommentLike', back_populates='user')

    def has_liked_post(self,id):
        return self.id in [like.user.id for like in db.session.get(Post, id).likes]

    def has_liked_comment(self,id):
        return self.id in [like.user.id for like in db.session.get(Comment, id).likes]


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.String(300))
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    #* Relationships *#
    user = db.relationship('User', back_populates='posts')
    likes = db.relationship('PostLike', back_populates='post')
    
    @classmethod
    def get_likes_from_post(cls,id):
        return len([like for like in PostLike.query.all() if like.post.id == id])
    
    
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    content = db.Column(db.String(300))
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    #* Relationships *#
    user = db.relationship('User', back_populates='comments')
    likes = db.relationship('CommentLike', back_populates='comment')

    @classmethod
    def get_likes_from_comment(cls,id):
        return len([like for like in CommentLike.query.all() if like.comment.id == id])

class Follower(db.Model, SerializerMixin):
    __tablename__ = 'followers'

    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    close_friend = db.Column(db.Boolean, default=False)

    follower = db.relationship('User', back_populates='followers', foreign_keys=[follower_id])
    following = db.relationship('User', back_populates='following', foreign_keys=[following_id])

class CommentLike(db.Model, SerializerMixin):
    __tablename__ = 'comment_likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', back_populates='comment_likes')
    comment = db.relationship('Comment', back_populates='likes')

class PostLike(db.Model, SerializerMixin):
    __tablename__ = 'post_likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', back_populates='post_likes')
    post = db.relationship('Post', back_populates='likes')
