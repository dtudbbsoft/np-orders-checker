from fastapi import APIRouter, Depends, Query
from db.main import get_db_session
from app.services.order_service import OrderService
from app.services.user_service import UserService
from app.models.order_schema import OrderGetParamsSchema as FilterParams, OrderCreateSchema, OrderUpdateSchema
from app.helpers.auth_helper import get_current_user_email

router = APIRouter()

def get_order_service(db_session=Depends(get_db_session)):
    return OrderService(db_session)

def get_user_service(db_session=Depends(get_db_session)):
    return UserService(db_session)

async def current_user(email: str = Depends(get_current_user_email), user_service: UserService = Depends(get_user_service)):
        user = None
        if email:
            user = await user_service.get_user_by_email(email)
        print("Current user:", user)
        return user

@router.get("/")
async def get_all_orders(current_user = Depends(current_user), order_service: OrderService = Depends(get_order_service), params: FilterParams = Depends()):
    return await order_service.get_all_orders(current_user, params)

@router.get("/{external_id}")
async def get_order_by_external_id(external_id: str, current_user = Depends(current_user), order_service: OrderService = Depends(get_order_service)):
    return await order_service.get_order_by_external_id(current_user, external_id)

@router.post("/")
async def create_order(order_create: OrderCreateSchema, current_user = Depends(current_user), order_service: OrderService = Depends(get_order_service)):
    return await order_service.create_order(current_user, order_create)

@router.patch("/{order_id}")
async def update_order(order_id: int, order_update: OrderUpdateSchema, current_user = Depends(current_user), order_service: OrderService = Depends(get_order_service)):
    return await order_service.update_order(current_user, order_id, order_update)