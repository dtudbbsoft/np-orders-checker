from fastapi import APIRouter, Depends
from db.main import get_db_session
from app.services.user_service import UserService
from app.models.user_schema import UserCreateSchema, UserUpdateSchema
from app.helpers.auth_helper import get_current_user_email

router = APIRouter()

def get_user_service(db_session=Depends(get_db_session)):
    return UserService(db_session)

@router.get("/me")
async def read_current_user(email: str = Depends(get_current_user_email), user_service: UserService = Depends(get_user_service)):
    return await user_service.get_user_by_email(email)

@router.post("/")
async def create_user(user_create: UserCreateSchema, email: str = Depends(get_current_user_email), user_service: UserService = Depends(get_user_service)):
    return await user_service.create_user(email, user_create)

@router.patch("/")
async def update_user(user_update: UserUpdateSchema, email: str = Depends(get_current_user_email), user_service: UserService = Depends(get_user_service)):
    return await user_service.update_user(email, user_update)

@router.delete("/")
async def delete_user(email: str = Depends(get_current_user_email), user_service: UserService = Depends(get_user_service)):
    return await user_service.delete_user(email)