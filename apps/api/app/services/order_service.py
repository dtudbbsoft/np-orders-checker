from fastapi import HTTPException, status
from sqlalchemy import select, func, asc, desc
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import (OrderModel, UserOrderModel)
from app.models.order_schema import (OrderSchema, AllOrdersSchema, OrderCreateSchema, OrderUpdateSchema, OrderGetParamsSchema)
from typing import Optional

class OrderService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_all_orders(self, current_user, params: OrderGetParamsSchema) -> AllOrdersSchema:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to access orders.",
            )
        query = select(OrderModel).join(UserOrderModel, isouter=False, onclause=UserOrderModel.UserId == current_user.id)
        if params.order.lower() == "asc":
            query = query.order_by(asc(getattr(OrderModel, params.sortBy)))
        else:
            query = query.order_by(desc(getattr(OrderModel, params.sortBy)))
        total_result = await self.db_session.execute(
            select(func.count()).select_from(OrderModel).join(UserOrderModel, isouter=False, onclause=UserOrderModel.UserId == current_user.id)
        )
        total_count = total_result.scalar_one()

        result = await self.db_session.execute(
            query.limit(params.limit).offset(params.offset)
        )
        return AllOrdersSchema(orders=[OrderSchema.from_orm(order) for order in result.scalars().all()], total=total_count)

    async def get_order_by_external_id(self, external_id: str) -> Optional[OrderSchema]:
        result = await self.db_session.execute(
            select(OrderModel).where(OrderModel.externalId == external_id)
        )
        order = result.scalars().first()

        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderSchema.from_orm(order)
    
    async def create_order(self, current_user, order_create: OrderCreateSchema) -> OrderSchema:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to access orders.",
            )
        
        try:
            new_order = OrderModel(
                externalId=order_create.externalId,
                name=order_create.name,
                description=order_create.description,
            )
            self.db_session.add(new_order)
            await self.db_session.flush()  # Get the order ID without committing
            
            # Create the junction table record
            user_order = UserOrderModel(
                UserId=current_user.id,
                OrderId=new_order.id
            )
            self.db_session.add(user_order)
            await self.db_session.commit()
            await self.db_session.refresh(new_order)
            return OrderSchema.from_orm(new_order)
        except IntegrityError as e:
            await self.db_session.rollback()
            error_info = str(e.orig) if hasattr(e, 'orig') else str(e)
            print("IntegrityError info:", error_info)
            if 'unique constraint' in error_info.lower() or 'duplicate key' in error_info.lower():
                if 'email' in error_info.lower():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT, 
                        detail="User with this email already exists"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT, 
                        detail="A user with these details already exists"
                    )
            elif 'check constraint' in error_info.lower():
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
                    detail="Data validation failed"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Data integrity constraint violation"
                )
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        

    async def update_order(self, current_user, order_id: int, order_update: OrderUpdateSchema) -> OrderSchema:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to access orders.",
            )
        try:
            stmt = select(OrderModel).where(OrderModel.id == order_id)
            result = await self.db_session.execute(stmt)
            order = result.scalar_one_or_none()
            if not order:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

            update_data = order_update.model_dump(exclude_unset=True)

            for field, value in update_data.items():
                setattr(order, field, value)

            await self.db_session.commit()
            await self.db_session.refresh(order)

            return OrderSchema.from_orm(order)
        except IntegrityError as e:
            await self.db_session.rollback()
            error_info = str(e.orig) if hasattr(e, 'orig') else str(e)
            
            if 'unique constraint' in error_info.lower() or 'duplicate key' in error_info.lower():
                if 'email' in error_info.lower():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT, 
                        detail="User with this email already exists"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT, 
                        detail="A user with these details already exists"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Data integrity constraint violation"
                )
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def delete_order(self, current_user, order_id: int) -> None:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to access orders.",
            )
        result = await self.db_session.execute(
            select(OrderModel).where(OrderModel.id == order_id)
        )
        order = result.scalars().first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found.",
            )
        await self.db_session.delete(order)
        try:
            await self.db_session.commit()
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the order.",
            ) from e
    
