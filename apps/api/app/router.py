from fastapi import APIRouter
from app.routers import (users_router, orders_router)

router = APIRouter()

router.include_router(users_router, prefix="/users", tags=["Users"])
router.include_router(orders_router, prefix="/orders", tags=["Orders"])