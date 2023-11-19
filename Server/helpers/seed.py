#!/usr/bin/env python3

import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask import Flask
from faker import Faker
import sys
sys.path.append('.')
#! Make sure to run this file from one directory up, or move the file up one directory or else it wont work !#
from models import db, User, Post, Comment, Follower, PostLike, CommentLike

# Create a Flask application to establish an application context
app = Flask(__name__)

# Specify the path to your SQLite database file
database_path = 'instance/database.db'

# Create the database engine and bind it to the Flask app
engine = create_engine(f'sqlite:///{database_path}')
db.metadata.create_all(engine)
db.app = app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)

# Create a Flask application context
with app.app_context():
    Session = sessionmaker(bind=engine)
    session = Session()

    fake = Faker()

    # Add seed data using Faker
    users = []

    for _ in range(5):
        user = User(username=fake.pystr(min_chars=5, max_chars=10), password=fake.password())
        session.add(user)
        users.append(user)

    session.commit()

    # Shuffle the users to ensure a random order
    random.shuffle(users)

    for i, user in enumerate(users):
        post = Post(user_id=user.id, content=fake.text())
        session.add(post)
        session.commit()  # Commit the post to get the post.id

        comment = Comment(user_id=user.id, post_id=post.id, content=fake.text())
        session.add(comment)
        session.commit()  # Commit the comment to get the comment.id

        # Ensure that the follower and following are different users
        other_user = users[(i + 1) % len(users)]

        follower = Follower(follower_id=user.id, following_id=other_user.id, close_friend=random.choice([True, False]))
        session.add(follower)

        post_like = PostLike(user_id=user.id, post_id=post.id)
        session.add(post_like)

        comment_like = CommentLike(user_id=user.id, comment_id=comment.id)
        session.add(comment_like)

    # Commit the changes
    session.commit()

    print("Seed data added successfully.")
