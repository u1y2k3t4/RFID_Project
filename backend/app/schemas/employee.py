from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class EmployeeBase(BaseModel):
    employee_code: str
    employee_name: str
    department: str
    email: EmailStr
    rfid_code: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    email: Optional[EmailStr] = None
    rfid_code: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
