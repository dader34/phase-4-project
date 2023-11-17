#!/usr/bin/env python
#! Server requirements !#
#At least two one-to-many relationships. # <-- [User:Posts,User:Messages?/User:Followers]
#* At least one reciprocal many-to-many relationship. # <-- User: friends
#?The many-to-many association model/table must have a user submittable attribute, i.e. an attribute aside from the foreign keys. # <-- Username?
#*Full CRUD actions for at least one resource. # <-- Posts, [Create Post,View Post, Edit Post, Delete Post]
#Minimum of create and read actions for EACH resource. <-- 
#! End of server requirements !#
#------------------------------#
#! Api Routes!#
#* /posts # <-- [Post: Create A Post, Get: View A Post, Patch: Update A Post, Delete: Delete A Post]
#* /posts/<int:id> # <-- Display one tweet in the middle of the page
#? /users # <-- Get all users?
#* /users/<int:id> # <-- Get specific user [Get: Returns Users Info]
#?     ^^^^  Could also do /username and have server convert to profile
#* /comments # <-- [Post: Create a new comment]
#* /comments/<int:CommentId> # <-- [Get: Returns a comment from specified id]
#* /login # <-- Post: Get json, and check db for user with same name and compare password then grant jwt
#* /signup # <-- Post: Get json, validate user/pass fits limits, add user to db and grant jwt
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


###*Comments table schema
### CREATE TABLE Comments (
###     comment_id INT PRIMARY KEY,
###     user_id INT,
###     post_id INT,
###     content TEXT,
###     likes INT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id),
###     FOREIGN KEY (post_id) REFERENCES Posts(post_id)
### );

###*Followers table schema
### CREATE TABLE Followers (
###     follower_id INT,
###     following_id INT,
###     PRIMARY KEY (follower_id, following_id),
###     FOREIGN KEY (follower_id) REFERENCES Users(user_id),
###     FOREIGN KEY (following_id) REFERENCES Users(user_id)
### );

###* Likes Table [Posts, ]
### CREATE TABLE Likes (
###     like_id INT PRIMARY KEY,
###     user_id INT,
###     target_id INT,
###     target_type VARCHAR(20),
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id),
###     CHECK (target_type IN ('post', 'comment'))
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

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api

app = Flask(__name__)
CORS(app)

@app.route('/')
def landing():
    return '<h1>Hello World!</h1>'

app.run(host='0.0.0.0',port=5555)