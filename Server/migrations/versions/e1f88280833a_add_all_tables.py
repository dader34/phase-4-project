"""Add all tables

Revision ID: e1f88280833a
Revises: 6c954519f6b5
Create Date: 2023-11-17 20:59:34.879778

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e1f88280833a'
down_revision = '6c954519f6b5'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('followers',
    sa.Column('follower_id', sa.Integer(), nullable=False),
    sa.Column('following_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['follower_id'], ['users.id'], name='fk_follower_id'),
    sa.ForeignKeyConstraint(['following_id'], ['users.id'], name='fk_following_id'),
    sa.PrimaryKeyConstraint('follower_id', 'following_id', name='pk_followers')
    )
    op.create_table('post_likes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('post_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], name='fk_post_id'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_post_like_user_id'),
    sa.PrimaryKeyConstraint('id', name='pk_post_likes')
    )
    op.create_table('comment_likes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('comment_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.ForeignKeyConstraint(['comment_id'], ['comments.id'], name='fk_comment_id'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_comment_like_user_id'),
    sa.PrimaryKeyConstraint('id', name='pk_comment_likes')
    )
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('post_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('content', sa.String(length=300), nullable=True))
        batch_op.add_column(sa.Column('likes', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.create_foreign_key('fk_comment_user_id', 'users', ['user_id'], ['id'])
        batch_op.create_foreign_key('fk_comment_post_id', 'posts', ['post_id'], ['id'])

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('content', sa.String(length=300), nullable=True))
        batch_op.add_column(sa.Column('likes', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.create_foreign_key('fk_post_user_id', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=12), nullable=True))
        batch_op.add_column(sa.Column('password', sa.String(length=40), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.create_unique_constraint('uq_username', ['username'])

    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('uq_username', type_='unique')
        batch_op.drop_column('created_at')
        batch_op.drop_column('password')
        batch_op.drop_column('username')

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_constraint('fk_post_user_id', type_='foreignkey')
        batch_op.drop_column('created_at')
        batch_op.drop_column('likes')
        batch_op.drop_column('content')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_comment_user_id', type_='foreignkey')
        batch_op.drop_constraint('fk_comment_post_id', type_='foreignkey')
        batch_op.drop_column('created_at')
        batch_op.drop_column('likes')
        batch_op.drop_column('content')
        batch_op.drop_column('post_id')
        batch_op.drop_column('user_id')

    op.create_table('likes',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.PrimaryKeyConstraint('id', name='pk_likes')
    )
    op.drop_table('comment_likes')
    op.drop_table('post_likes')
    op.drop_table('followers')
    # ### end Alembic commands ###