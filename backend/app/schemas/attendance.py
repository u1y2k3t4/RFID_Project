from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.attendance import AttendanceStatus


class AttendanceBase(BaseModel):
    employee_id: int
    attendance_date: datetime
    status: AttendanceStatus = AttendanceStatus.PRESENT


class AttendanceCreate(BaseModel):
    rfid_code: str


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    attendance_date: datetime
    checkin_time: Optional[datetime]
    status: AttendanceStatus
    
    class Config:
        from_attributes = True


class RFIDScanResponse(BaseModel):
    success: bool
    message: str
    employee_name: Optional[str] = None
    checkin_time: Optional[datetime] = None
