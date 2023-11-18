#!/usr/bin/env python3

import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from faker import Faker
from models import db, User, Post, Comment, Follower, PostLike, CommentLike

# Specify the path to your SQLite database file
database_path = 'instance/database.db'

engine = create_engine(f'sqlite:///{database_path}')
db.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

fake = Faker()

# Add seed data using Faker
users = []

for _ in range(5):
    user = User(username=fake.user_name(), password=fake.password())
    session.add(user)
    users.append(user)

session.commit()

# Shuffle the users to ensure random order
random.shuffle(users)

for i, user in enumerate(users):
    post = Post(user_id=user.id, content=fake.text())
    session.add(post)
    session.commit()  # Commit the post to get the post.id

    comment = Comment(user_id=user.id, post_id=post.id, content=fake.text())
    session.add(comment)

    # Ensure that the follower and following are different users
    other_user = users[(i + 1) % len(users)]

    follower = Follower(follower_id=user.id, following_id=other_user.id)
    session.add(follower)

    post_like = PostLike(user_id=user.id, post_id=post.id)
    session.add(post_like)

    comment_like = CommentLike(user_id=user.id, comment_id=comment.id)
    session.add(comment_like)

# Commit the changes
session.commit()

print("Seed data added successfully.")
