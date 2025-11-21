"""add chatbot models

Revision ID: c5f6d7e8f9a0
Revises: ae09b78c09da
Create Date: 2025-11-21 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c5f6d7e8f9a0'
down_revision = 'ae09b78c09da'
branch_labels = None
depends_on = None


def upgrade():
    # Create chatsession table
    op.create_table(
        'chatsession',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sqlmodel.sql.sqltypes.AutoString(length=30), nullable=False),
        sa.Column('updated_at', sqlmodel.sql.sqltypes.AutoString(length=30), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chatsession_id'), 'chatsession', ['id'], unique=False)
    
    # Create chatmessage table
    op.create_table(
        'chatmessage',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('session_id', sa.UUID(), nullable=False),
        sa.Column('role', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=False),
        sa.Column('content', sqlmodel.sql.sqltypes.AutoString(length=10000), nullable=False),
        sa.Column('created_at', sqlmodel.sql.sqltypes.AutoString(length=30), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['chatsession.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chatmessage_id'), 'chatmessage', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_chatmessage_id'), table_name='chatmessage')
    op.drop_table('chatmessage')
    op.drop_index(op.f('ix_chatsession_id'), table_name='chatsession')
    op.drop_table('chatsession')
