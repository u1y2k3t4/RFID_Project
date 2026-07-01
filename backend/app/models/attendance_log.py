from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class AttendanceLog(Base):
    __tablename__ = "attendance_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    action = Column(String(50), nullable=False)  # checkin, checkout, etc.
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    employee = relationship("Employee", backref="attendance_logs")
