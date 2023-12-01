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

from flask import Flask, jsonify, request, make_response, render_template
from datetime import timedelta, datetime
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import db, Post, User, PostLike, Follower
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import desc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
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
        try:
            page = request.args.get('page', default=1, type=int)
            limit = request.args.get('limit', default=10, type=int)
            start = (page - 1) * limit
            end = start + limit + 1  # Fetch one more to see if more posts

            posts = Post.query.order_by(desc(Post.created_at))[start:end]

            more_posts = len(posts) > limit
            if more_posts:
                # Remove the extra post used for checking
                posts = posts[:limit]

            return {
                'posts': [post.to_dict(rules=('-post_likes',)) for post in posts],
                'more_posts': more_posts
            }
        except Exception as e:
            return {"error": "Invalid pagination parameters"}, 400
api.add_resource(GetAllPosts,'/posts')
    
class PostById(Resource):
    def get(self,id):
        if post := db.session.get(Post,id):
            try:
                post.views += 0.5
                db.session.commit()
                return{
                'main':post.to_dict(rules=('-user.likes','-comments','-user_id','-post_likes',)),
                'comments':[
                    comment.to_dict(rules=('-user_id','-post_likes',)) for comment in post.comments
                ]
            }
            except Exception as e:
                db.session.rollback()
                return {'error':'Could not update views'}
            
    @jwt_required()  
    def delete(self,id):
        user_id = get_jwt_identity()  
        
        
        post = db.session.get(Post,id)
        if not post:
            return {'error': 'Post not found'}, 404

        
        if post.user_id == user_id:
            db.session.delete(post)
            db.session.commit()
            return {'message': 'Post deleted successfully'}, 200
        else:
            return {'error': 'Unauthorized'}, 403

        
api.add_resource(PostById, '/posts/<int:id>')

class Signup(Resource):
    def post(self):
        if (username := request.json.get("username")) and (password := request.json.get("password")):
            if(User.query.filter(db.func.lower(User.username) == db.func.lower(username)).first()):
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
        
    @jwt_required()
    def patch(self):
        jwt_id = get_jwt_identity()
        if (jwt_id) and (pfp := request.json.get("pfp")) and (bio := request.json.get("bio")):
            if user := db.session.get(User,int(jwt_id)):
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
        

api.add_resource(Signup, '/signup')

class UpdateBio(Resource):
    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()

        new_bio = request.json.get('bio')

        try:
            user = db.session.query(User).filter_by(id=user_id).first()
            if user:
                user.user_bio = new_bio
                db.session.commit()
                return {'message': 'Bio updated successfully'}, 200
            else:
                return {'error': 'User not found'}, 404
        except Exception as e:
            db.session.rollback()

    
api.add_resource(UpdateBio,'/user/update-bio')
    
class Login(Resource):
    def post(self):
        if (username := request.json.get("username")) and (password := request.json.get("password")):
            if user:= User.query.filter(db.func.lower(User.username) == db.func.lower(username)).first():
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

class MakePost(Resource):
    @jwt_required()
    def post(self):
        id = get_jwt_identity()
        parent_id = request.json.get('parent_id')
        user_id = request.json.get('user_id')
        content = request.json.get('content')
        #!Add validations
        if (user_id and content):
            if(int(id) == int(user_id)):
                try:
                    post = Post(user_id=int(user_id),content=content,parent_post=parent_id)
                    db.session.add(post)
                    db.session.commit()
                    return post.to_dict(),201
                except Exception as e:
                    db.session.rollback()
                    return {"validation errors":e.args}
            else:
                return {"error","You are not authenticated"},401
        else:
            return {"invalid data":"The server could not process your data"},400
        
api.add_resource(MakePost,'/post')

class AddLike(Resource):
    @jwt_required()
    def post(self):
        id = get_jwt_identity()
        user_id = request.json.get('user_id')
        post_id = request.json.get('post_id')
        if user_id and post_id:
            if int(id) == int(user_id):
                liked = False
                post = db.session.get(Post,int(post_id))
                user = db.session.get(User,int(user_id))
                for like in post.to_dict(rules=('-post_likes.user','-post_likes.post',))['post_likes']:
                    if(like['user_id'] == user.id):
                        liked = like
                        break
                try:
                    if liked:
                        #!!!!Erroring because liked['id'] is a userid and not postlike id
                        pl = db.session.get(PostLike,liked['id'])
                        print(liked)
                        # print(pl.to_dict())
                        db.session.delete(pl)
                        db.session.commit()
                        return {'likes':len(post.likes)}
                    else:
                        pl = PostLike(user_id=int(user_id),post_id=int(post_id))
                        # print(pl.to_dict())
                        db.session.add(pl)
                        db.session.commit()
                        return {'likes':len(pl.post.likes)}
                except Exception as e:
                    db.session.rollback()
                    return {"validation errors":e.args}
            
            else:
                return {"error":1}
            
api.add_resource(AddLike,'/like')

class Embed(Resource):
    def get(self,id):
        if id and (post := db.session.get(Post,int(id))):
            headers = {'Content-Type': 'text/html'}
            return make_response(render_template('embed.html',post=post.to_dict(rules=('-post_likes',))),200,headers)
        else:
            return {"error":"invalid post"}


api.add_resource(Embed,'/embed/<int:id>')

class UserById(Resource):
    @jwt_required()
    def get(self,id):
        if id and (user := db.session.get(User,id)):
            return user.to_dict(only=('id','username','profile_picture','user_bio','created_at','posts.user.username','posts.user.profile_picture','followers.follower.username','followers.follower.id','followers.follower.user_bio','followers.follower.profile_picture','following.following.username','following.following.user_bio','following.following.profile_picture','following.following.id','posts.views','posts.created_at','posts.likes.username','posts.id','posts.content'))
        else:
            return {"error":"invalid user id"},400
        
    @jwt_required()
    def delete(self,id):
        current_user_id = get_jwt_identity()
        if current_user_id != id:
            return {'error': 'Unauthorized'}, 403

        user = User.query.get(id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User account deleted successfully'}, 200
        
api.add_resource(UserById,'/user/<int:id>')

class FollowUser(Resource):
    @jwt_required()
    def post(self,id):
        account = False
        identity = get_jwt_identity()
        if id and (user:=db.session.get(User,identity)):
            for follower in user.following:
                if follower.following_id == id:
                    account = follower
                    break
            try:
                if account:
                    follow = Follower.query.filter_by(follower_id=identity,following_id=account.following_id).first()
                    db.session.delete(follow)
                    db.session.commit()
                    return {"status":"Follow"}
                else:
                    follow = Follower(follower_id=identity,following_id=id)
                    db.session.add(follow)
                    db.session.commit()
                    return {"status":"Unfollow"}
            except Exception as e:
                db.session.rollback()
                return {"error":e.args}
                    
        else:
            return {"error":"user not found"},404

api.add_resource(FollowUser,'/follow/<int:id>')

@app.template_filter('format_date')
def format_date(date_str):
    # Convert the string to a datetime object
    post_datetime = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    
    # Format the datetime object as "Nov 28, 2023, 2:33 PM"
    formatted_date = post_datetime.strftime("%b %d, %Y, %I:%M %p")
    
    return formatted_date

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5555, debug=True)