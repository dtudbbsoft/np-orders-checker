from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime

class OrderSchema(BaseModel):
    """Schema for order data."""

    id: int
    name: str
    externalId: str
    status: Optional[str] = None
    description: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class AllOrdersSchema(BaseModel):
    """Schema for multiple orders response."""
    orders: List[OrderSchema]
    total: int

class OrderCreateSchema(BaseModel):
    """Schema for creating a new order."""
    name: str
    externalId: str
    description: Optional[str] = None

class OrderUpdateSchema(BaseModel):
    """Schema for updating an existing order."""
    name: Optional[str] = None
    externalId: Optional[str] = None
    description: Optional[str] = None

class OrderGetParamsSchema(BaseModel):
    """Schema for order query parameters."""
    sortBy: Optional[Literal["createdAt", "name", "status"]] = "createdAt"
    order: Literal["asc", "desc"] = "asc"
    offset: Optional[int] = 0
    limit: Optional[int] = 10
