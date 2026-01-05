from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .order_schema import OrderSchema

class UserSchema(BaseModel):
    """Schema for user data."""

    id: int
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    isActive: bool
    orders: List[OrderSchema] = []
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class AllUsersSchema(BaseModel):
    """Schema for multiple users response."""
    users: List[UserSchema]
    total: int

class UserCreateSchema(BaseModel):
    """Schema for creating a new user."""
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None

class UserUpdateSchema(BaseModel):
    """Schema for updating a user."""
    name: Optional[str] = None
    phone: Optional[str] = None