from datetime import datetime
from sqlalchemy import DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column

class TimestampMixin:
    """Mixin that adds timestamp fields to models."""
    
    createdAt: Mapped[datetime] = mapped_column(
        DateTime(), default=func.now(), nullable=False
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime(), default=func.now(), onupdate=func.now(), nullable=True
    )

Base = declarative_base()

class BaseModel(Base, TimestampMixin):
    """Base model class with timestamps that all models should inherit from."""
    __abstract__ = True

