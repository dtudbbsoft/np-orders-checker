from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String

from db.base import Base

class OrderModel(Base):
    """Model for demo purpose."""

    __tablename__ = "order"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(length=200), nullable=False)
    externalId: Mapped[str] = mapped_column(String(length=200), nullable=False)
    status: Mapped[str] = mapped_column(String(length=50), nullable=True)
    description: Mapped[str] = mapped_column(String(length=500), nullable=True)

    __table_args__ = (UniqueConstraint("externalId"),)
