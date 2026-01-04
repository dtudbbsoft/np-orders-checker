from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String, Boolean

from db.base import Base

class UserModel(Base):
    """Model for demo purpose."""

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(length=200), nullable=True)
    email: Mapped[str] = mapped_column(String(length=200), nullable=True)
    phone: Mapped[str] = mapped_column(String(length=20), nullable=True)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
