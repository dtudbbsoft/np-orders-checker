from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import (UserModel, OrderModel, UserOrderModel)
from app.models.user_schema import UserSchema, UserCreateSchema, UserUpdateSchema

class UserService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_all_users(self):
        result = await self.db_session.execute(select(UserModel))
        users = result.scalars().all()
        return users
    
    async def get_user_by_id(self, user_id: int) -> UserSchema:
        stmt = select(UserModel)\
            .join(UserOrderModel, UserModel.id == UserOrderModel.UserId, isouter=True)\
            .join(OrderModel, UserOrderModel.OrderId == OrderModel.id, isouter=True)\
            .where(UserModel.id == user_id)
        
        result = await self.db_session.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
        return UserSchema.from_orm(user)
    
    async def create_user(self, user_create: UserCreateSchema) -> UserSchema:
        try:
            new_user = UserModel(
                email=user_create.email,
                name=user_create.name,
                phone=user_create.phone,
                isActive=False
            )
            self.db_session.add(new_user)
            print("Added new user to session:", new_user)
            await self.db_session.commit()
            await self.db_session.refresh(new_user)
            return UserSchema.from_orm(new_user)
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
    
    async def update_user(self, user_id: int, user_update: UserUpdateSchema) -> UserSchema:
        try:
            stmt = select(UserModel).where(UserModel.id == user_id)
            result = await self.db_session.execute(stmt)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            user.name = user_update.name
            user.phone = user_update.phone

            self.db_session.add(user)
            await self.db_session.commit()
            await self.db_session.refresh(user)

            return UserSchema.from_orm(user)
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
    
    async def delete_user(self, user_id: int) -> None:
        try:
            stmt = select(UserModel).where(UserModel.id == user_id)
            result = await self.db_session.execute(stmt)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            await self.db_session.delete(user)
            await self.db_session.commit()
        except IntegrityError as e:
            await self.db_session.rollback()
            error_info = str(e.orig) if hasattr(e, 'orig') else str(e)
            
            if 'foreign key constraint' in error_info.lower() or 'violates foreign key' in error_info.lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, 
                    detail="Cannot delete user: user has associated orders or other related data"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Cannot delete user due to data constraints"
                )
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))