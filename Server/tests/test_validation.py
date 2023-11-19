import pytest
import sys
sys.path.append('.')
from models import User, Post, Comment, Follower, CommentLike, PostLike
from main import app, db  

# Use the existing app instance for testing
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

# Test User model validations
def test_user_username_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Username must be between 5 and 12 characters"):
            User(username="four", password="password")

        with pytest.raises(ValueError, match="Name can only contain letters, numbers, and underscores"):
            User(username="!invalid@", password="password")

def test_user_password_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Password must be longer than 5 characters and less than 75"):
            User(username="valid_name", password="pass")

# Test Post model validations
def test_post_user_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Post(user_id=999, content="valid_content")

def test_post_content_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Content must be between 1 and 300 chars and not empty"):
            Post(user_id=1, content="")

# Test Comment model validations
def test_comment_user_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Comment(user_id=999, post_id=1, content="valid_content")

def test_comment_post_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Post id must be a valid post"):
            Comment(user_id=1, post_id=999, content="valid_content")

def test_comment_content_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Content must be between 1 and 300 chars and not empty"):
            Comment(user_id=1, post_id=1, content="")

# Test Follower model validations
def test_follower_follower_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Follower(follower_id=999, following_id=1)

def test_follower_following_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            Follower(follower_id=1, following_id=999)

def test_follower_close_friend_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="close_friend must be a boolean"):
            Follower(follower_id=1, following_id=2, close_friend="invalid")

# Test CommentLike model validations
def test_comment_like_user_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            CommentLike(user_id=999, comment_id=1)

def test_comment_like_comment_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Comment id must be a valid comment"):
            CommentLike(user_id=1, comment_id=999)

# Test PostLike model validations
def test_post_like_user_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="User id must be a valid user"):
            PostLike(user_id=999, post_id=1)

def test_post_like_post_id_validation(client):
    with app.app_context():
        with pytest.raises(ValueError, match="Post id must be a valid post"):
            PostLike(user_id=1, post_id=999)
