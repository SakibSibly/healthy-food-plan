"""merge chatbot and meal plans

Revision ID: 76a91dc29733
Revises: 33ad4d37c229, c5f6d7e8f9a0
Create Date: 2025-11-21 16:14:22.270734

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '76a91dc29733'
down_revision: Union[str, Sequence[str], None] = ('33ad4d37c229', 'c5f6d7e8f9a0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
