from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String, Boolean
from typing import List, TYPE_CHECKING

from db.base import Base

if TYPE_CHECKING:
    from .user_orders_model import UserOrderModel

class UserModel(Base):
    """Model for demo purpose."""

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(length=200), nullable=True)
    email: Mapped[str] = mapped_column(String(length=200), nullable=False, unique=True)
    phone: Mapped[str] = mapped_column(String(length=20), nullable=True)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Relationships
    user_orders: Mapped[List["UserOrderModel"]] = relationship(
        "UserOrderModel", back_populates="user", cascade="all, delete-orphan"
    )
