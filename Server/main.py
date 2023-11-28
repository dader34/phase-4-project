#!/usr/bin/env python
#! Server requirements !#
#At least two one-to-many relationships. # <-- [User:Posts,User:Messages?/User:Followers]
#* At least one reciprocal many-to-many relationship. # <-- User: friends
#* The many-to-many association model/table must have a user submittable attribute, i.e. an attribute aside from the foreign keys. # <-- Followers, close_friend: Bool
#* Full CRUD actions for at least one resource. # <-- Posts, [Create Post,View Post, Edit Post, Delete Post]
#Minimum of create and read actions for EACH resource. <-- 
#! End of server requirements !#
#------------------------------#
#! Api Routes!#
#* /posts # <-- || Requires auth || [Post: Create A Post, Get: View A Post, Patch: Update A Post, Delete: Delete A Post]
#* /posts/<int:id> # <-- Display one tweet in the middle of the page
#? /users # <-- Get all users?
#* /users/<int:id> # <-- Get specific user [Get: Returns Users Info]
#?     ^^^^  Could also do /username and have server convert to profile
#* /comments # <-- || Requires auth || [Post: Create a new comment]
#* /comments/<int:CommentId> # <-- [Get: Returns a comment from specified id]
#* /login # <-- || Requires auth || Post: Get json, and check db for user with same name and compare password then grant jwt
#* /signup # <-- Post: Get json, validate user/pass fits limits, add user to db and grant jwt
#* /like # <-- || Requires auth || Post: json:{type_post:"comment" or "post", type:{"Like" or "Unlike"} ,JWT}
#* /followers/<int:UserId> #[Get: Get users followers from id,Post: Add follower to users followers from id]
#* /unfollow/<int:UserId> # Post: Get json follower id. Remove uid/follower relation from db.
#! Stretch goals for Api routes !#
#? /messages # <-- [Post: Create a new Message]
#? /messages/<int:MessageId> # <-- [Get: Returns a message from specified id, Delete: Deletes message, Patch?:Edit?]
#? /chat/<int:ChatId> # <-- Displays a certain chat if the current user is in the chat
#?     ^^^^^^^ Returns a list of chats like
### {
###    Chat: {
###     id: <int:ChatId>,
###     user_one: <int:UserId>,
###     user_two: <int:UserId>,
###     created_at: <DateTime:Time>
###
###    },
###    Messages: [
###     {
###      from: <int:UserId>,
###      to: <int:UserId>,
###      contents: <String:Body>
###      sent_at: <DateTime:Time>,
###     }
###    ]
### }


#! End Of Api Routes !#
#-----------------#
#! SQL Tables !#
#? TODO ?#
#? Figure out how to keep track of liked posts and comments, sql table for both? ?#
#? Maybe have table for both with post/comment id, and user id that liked it? ?#
#? When loading post from get, check if user has liked the post, and if they have backend should add "Liked" json attribute to body of return as true else false ?#
#? Same with comments ^^^^^^^ #?
#* Current implementation, use one table for both types of likes. Query this table and check type to see if user has liked a post/comment on every get request *#
#? End TODO #? 
###*Users table schema
### CREATE TABLE Users (
###    user_id INT PRIMARY KEY,
###     username VARCHAR(12) UNIQUE,
###     password VARCHAR(100),
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
### );

###*Posts table schema
### CREATE TABLE Posts (
###     post_id INT PRIMARY KEY,
###     user_id INT,
###     content TEXT,
###     likes INT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id)
### );



###*Followers table schema
### CREATE TABLE Followers (
###     follower_id INT,
###     following_id INT,
###     PRIMARY KEY (follower_id, following_id),
###     FOREIGN KEY (follower_id) REFERENCES Users(user_id),
###     FOREIGN KEY (following_id) REFERENCES Users(user_id)
### );

###* Likes Table [Posts, Comments]
### CREATE TABLE Likes (
###     like_id INT PRIMARY KEY,
###     user_id INT,
###     post id INT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id),
### );

#? Stretch Goal SQL Tables
### Chats table schema
### CREATE TABLE Chats (
###     chat_id INT PRIMARY KEY,
###     user1_id INT,
###     user2_id INT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user1_id) REFERENCES Users(user_id),
###     FOREIGN KEY (user2_id) REFERENCES Users(user_id)
### );

### Messages table schema
### CREATE TABLE Messages (
###     message_id INT PRIMARY KEY,
###     chat_id INT,
###     sender_id INT,
###     content TEXT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (chat_id) REFERENCES Chats(chat_id),
###     FOREIGN KEY (sender_id) REFERENCES Users(user_id)
### );

from flask import Flask, jsonify, request, make_response
from datetime import timedelta
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import db, Post, User, PostLike, Follower
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
CORS(app)
db.init_app(app)
api = Api(app)
migrate = Migrate(app,db)
jwt = JWTManager(app)

@app.route('/')
def landing():
    return '<h1>Hello World!</h1>'

class GetAllPosts(Resource):
    def get(self):
        return [post.to_dict() for post in Post.query.all()]
    
api.add_resource(GetAllPosts,'/posts')
    
class PostById(Resource):
    def get(self,id):
        if post := db.session.get(Post,id):
            try:
                post.views += 0.5
                db.session.commit()
            except Exception as e:
                print("Could not update view count")
                print(e)
            return{
                'main':post.to_dict(rules=('-user.likes','-comments','-user_id')),
                'comments':[
                    comment.to_dict(rules=('-user_id',)) for comment in post.comments
                ]
            }
        
api.add_resource(PostById, '/posts/<int:id>')

#Signup route
#Get username and password
#Validate username and pass > 4 characters < 15
#Check if username is already in database
#Create user in database
#Commit changes
#Send back authenticated jwt and user id

class Signup(Resource):
    def post(self):
        if (username := request.json.get("username")) and (password := request.json.get("password")):
            if(User.query.filter_by(username=username).first()):
                return {"error":"Username already exists"},409
            else:
                try:
                    user = User(username=username)
                    user.password = password
                    db.session.add(user)
                    db.session.commit()
                    token = create_access_token(identity=user.id)
                    return {"UID":user.id,"JWT":token},201
                except Exception as e:
                    db.session.rollback()
                    return {"Validation Errors":e.args},400
        else:
            return {"invalid data":"The server could not process your data"},400
api.add_resource(Signup, '/signup')
class FinishSignup(Resource):
    def patch(self,id):
        if (id) and (pfp := request.json.get("pfp")) and (bio := request.json.get("bio")):
            if user := db.session.get(User,id):
                try:
                    user.user_bio = bio
                    user.profile_picture = pfp
                    db.session.commit()
                    return user.to_dict()
                except Exception as e:
                    db.session.rollback()
                    return {'Validation errors':e.args},400
            else:
                return {"error":"User not found"},404
        else:
            return {"invalid data":"The server could not process your data"},400

api.add_resource(FinishSignup, '/signup/<int:id>')

class Login(Resource):
    def post(self):
        if (username := request.json.get("username")) and (password := request.json.get("password")):
            if user:= User.query.filter_by(username=username).first():
                if user.authenticate(password=password):
                    token = create_access_token(identity=user.id)
                    return {"UID":user.id,"JWT":token},201
                else:
                    return {"error":"password is incorrect"},401
            else:
                return {"error":"User not found"},404
        else:
            return {"invalid data":"The server could not process your data"},400
    
api.add_resource(Login, '/login')

class Authenticated(Resource):
    @jwt_required()
    def get(self):
        id = get_jwt_identity()
        if db.session.get(User,int(id)):
            return {"success":True},200
        else:
            return {"error":"User not authenticated"},401

api.add_resource(Authenticated, '/auth')


if(__name__=="__main__"):
    app.run(host='0.0.0.0',port=5555,debug=True)