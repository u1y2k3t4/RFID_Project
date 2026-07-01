from pydantic import BaseModel
from app.models.user import UserRole


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.MANAGER


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
