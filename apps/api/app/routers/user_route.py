from fastapi import APIRouter, Depends
from db.main import get_db_session
from app.services.user_service import UserService
from app.models.user_schema import UserCreateSchema, UserUpdateSchema

router = APIRouter()

def get_user_service(db_session=Depends(get_db_session)):
    return UserService(db_session)

@router.get("/{user_id}")
async def read_current_user(user_id: int, user_service: UserService = Depends(get_user_service)):
    return await user_service.get_user_by_id(user_id)

@router.get("/")
async def read_all_users(
    user_service: UserService = Depends(get_user_service),
    limit: int = 10,
    offset: int = 0,
    sort_by: str = "id",
    sort_order: str = "asc"
    ):
    return await user_service.get_all_users(limit=limit, offset=offset, sort_by=sort_by, sort_order=sort_order)

@router.post("/")
async def create_user(user_create: UserCreateSchema, user_service: UserService = Depends(get_user_service)):
    print("Creating user with user:", user_create)
    return await user_service.create_user(user_create)

@router.patch("/{user_id}")
async def update_user(user_id: int, user_update: UserUpdateSchema, user_service: UserService = Depends(get_user_service)):
    return await user_service.update_user(user_id, user_update)

@router.delete("/{user_id}")
async def delete_user(user_id: int, user_service: UserService = Depends(get_user_service)):
    return await user_service.delete_user(user_id)