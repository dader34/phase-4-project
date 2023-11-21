import ipdb
from main import db, app
from models import User, Post, Comment, Follower, PostLike, CommentLike

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"

with app.app_context():
    try:
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        print("Successfully cleared the database")
    except Exception as e:
        print(f"Error: {e.args}")
        db.session.rollback()
        
    u1 = User(username="TestName", password="securepassword")
    u2 = User(username="TestName2", password="securepassword2")
    db.session.add_all([u1, u2])
    db.session.commit()

    p1 = Post(user_id=u1.id, content="Test content")
    p2 = Post(user_id=u2.id, content="Test content2")
    db.session.add_all([p1, p2])
    db.session.commit()

    c1 = Comment(user_id=u1.id, post_id=p2.id, content="Test content")
    c2 = Comment(user_id=u2.id, post_id=p1.id, content="Test content2")
    db.session.add_all([c1, c2])
    db.session.commit()

    f1 = Follower(follower_id=u1.id, following_id=u2.id)
    f2 = Follower(follower_id=u2.id, following_id=u1.id)
    db.session.add_all([f1, f2])
    db.session.commit()

    cl1 = CommentLike(user_id=u1.id, comment_id=c2.id)
    cl2 = CommentLike(user_id=u2.id, comment_id=c1.id)
    db.session.add_all([cl1, cl2])
    db.session.commit()

    pl1 = PostLike(user_id=u1.id, post_id=p2.id)
    pl2 = PostLike(user_id=u2.id, post_id=p1.id)
    db.session.add_all([pl1, pl2])
    db.session.commit()

    ipdb.set_trace()

    ipdb.set_trace()
