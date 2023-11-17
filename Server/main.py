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
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id)
### );


###*Comments table schema
### CREATE TABLE Comments (
###     comment_id INT PRIMARY KEY,
###     user_id INT,
###     post_id INT,
###     content TEXT,
###     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
###     FOREIGN KEY (user_id) REFERENCES Users(user_id),
###     FOREIGN KEY (post_id) REFERENCES Posts(post_id)
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