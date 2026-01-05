from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String
from typing import List, TYPE_CHECKING

from db.base import BaseModel

if TYPE_CHECKING:
    from .user_orders_model import UserOrderModel

class OrderModel(BaseModel):
    """Model for demo purpose."""

    __tablename__ = "order"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(length=200), nullable=False)
    externalId: Mapped[str] = mapped_column(String(length=200), nullable=False)
    status: Mapped[str] = mapped_column(String(length=50), nullable=True)
    description: Mapped[str] = mapped_column(String(length=500), nullable=True)
    
    # Relationships
    user_orders: Mapped[List["UserOrderModel"]] = relationship(
        "UserOrderModel", back_populates="order", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("externalId"),)
