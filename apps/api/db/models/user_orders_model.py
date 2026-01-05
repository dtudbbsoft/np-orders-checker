from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import BaseModel

class UserOrderModel(BaseModel):
    """Junction table to connect users with their created orders."""

    __tablename__ = "user_orders"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    UserId: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    OrderId: Mapped[int] = mapped_column(
        ForeignKey("order.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="user_orders")
    order: Mapped["OrderModel"] = relationship("OrderModel", back_populates="user_orders")

    __table_args__ = (
        UniqueConstraint("UserId", "OrderId", name="uq_user_order"),
    )