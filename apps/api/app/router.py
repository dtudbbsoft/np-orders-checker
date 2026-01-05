from fastapi import APIRouter
from app.routers import (users_router)

router = APIRouter()

router.include_router(users_router, prefix="/users", tags=["Users"])