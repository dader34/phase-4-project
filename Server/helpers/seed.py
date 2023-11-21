#!/usr/bin/env python3

import random
from faker import Faker
import sys
sys.path.append('.')
from models import db, User, Post, Follower, PostLike
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
        # Create a root post for each user
        root_post = Post(user_id=user.id, content=fake.text())
        db.session.add(root_post)
        db.session.commit()  # Commit the root post to get the post.id

        # Create comments (nested posts) for the root post
        for _ in range(random.randint(1, 3)):
            nested_post = Post(user_id=user.id, content=fake.text(), parent_post=root_post.id)
            db.session.add(nested_post)
            db.session.commit()  # Commit the nested post to get the post.id

        # Ensure that the follower and following are different users
        other_user = users[(i + 1) % len(users)]

        follower = Follower(follower_id=user.id, following_id=other_user.id, close_friend=random.choice([True, False]))
        db.session.add(follower)

        post_like = PostLike(user_id=user.id, post_id=root_post.id)
        db.session.add(post_like)

    # Commit the changes
    db.session.commit()

    print("Seed data added successfully.")
