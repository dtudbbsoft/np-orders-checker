from pydantic import BaseModel
from typing import Optional

class OrderSchema(BaseModel):
    """Schema for order data."""

    id: int
    name: str
    externalId: str
    status: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class OrderCreateSchema(BaseModel):
    """Schema for creating a new order."""

    name: str
    externalId: str
    description: Optional[str] = None
