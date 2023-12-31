import pytest
import sys
sys.path.append('.')
#! Make sure to run this file from one directory up, or move the file up one directory or else it wont work !#
from models import User, Post, Follower, PostLike
from main import app

# Test User model validations
def test_user_username_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="Username must be between 5 and 12 characters"):
            f = User(username="four")
            f.password="password"

        with pytest.raises(ValueError, match="Name can only contain letters, numbers, and underscores"):
            f = User(username="!invalid@")
            f.password="password"

def test_user_password_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="Password must be longer than 5 characters and less than 75"):
            f = User(username="valid_name")
            f.password="pass"

# Test Post model validations
def test_post_user_id_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Post(user_id=999, content="valid_content")

def test_post_content_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="Content must be between 1 and 300 chars and not empty"):
            Post(user_id=1, content="")

# Test Follower model validations
def test_follower_follower_id_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Follower(follower_id=999, following_id=1)

def test_follower_following_id_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Follower(follower_id=1, following_id=999)

def test_follower_close_friend_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="close_friend must be a boolean"):
            Follower(follower_id=1, following_id=2, close_friend="invalid")

# Test PostLike model validations
def test_post_like_user_id_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            PostLike(user_id=999, post_id=1)

def test_post_like_post_id_validation():
    with app.app_context():
        with pytest.raises(ValueError, match="Post id must be a valid post"):
            PostLike(user_id=1, post_id=999)
