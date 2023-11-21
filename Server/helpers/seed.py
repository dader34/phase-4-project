#!/usr/bin/env python3

import random
from faker import Faker
import sys
sys.path.append('.')
#! Make sure to run this file from one directory up, or move the file up one directory or else it wont work !#
from models import db, User, Post, Comment, Follower, PostLike, CommentLike
from main import app

# Create a Flask application context
with app.app_context():


    fake = Faker()

    # Add seed data using Faker
    users = []

    for _ in range(5):
        profile_picture_url = fake.image_url()
        user = User(username=fake.pystr(min_chars=5, max_chars=10), password=fake.password(), profile_picture=profile_picture_url)
        db.session.add(user)
        users.append(user)

    db.session.commit()

    # Shuffle the users to ensure a random order
    random.shuffle(users)

    for i, user in enumerate(users):
        post = Post(user_id=user.id, content=fake.text())
        db.session.add(post)
        db.session.commit()  # Commit the post to get the post.id

        comment = Comment(user_id=user.id, post_id=post.id, content=fake.text())
        db.session.add(comment)
        db.session.commit()  # Commit the comment to get the comment.id

        # Ensure that the follower and following are different users
        other_user = users[(i + 1) % len(users)]

        follower = Follower(follower_id=user.id, following_id=other_user.id, close_friend=random.choice([True, False]))
        db.session.add(follower)

        post_like = PostLike(user_id=user.id, post_id=post.id)
        db.session.add(post_like)

        comment_like = CommentLike(user_id=user.id, comment_id=comment.id)
        db.session.add(comment_like)

    # Commit the changes
    db.session.commit()

    print("Seed data added successfully.")
