from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"


class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    attendance_date = Column(DateTime(timezone=True), nullable=False)
    checkin_time = Column(DateTime(timezone=True))
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.PRESENT)
    
    employee = relationship("Employee", backref="attendance_records")
