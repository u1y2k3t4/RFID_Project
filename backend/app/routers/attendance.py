from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, date
from typing import List, Optional
from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance, AttendanceStatus
from app.models.attendance_log import AttendanceLog
from app.schemas.attendance import AttendanceCreate, AttendanceResponse, RFIDScanResponse
from app.auth.dependencies import get_current_manager_or_admin

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/scan", response_model=RFIDScanResponse)
def scan_rfid(
    scan_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    # Find employee by RFID code
    employee = db.query(Employee).filter(Employee.rfid_code == scan_data.rfid_code).first()
    
    if not employee:
        return RFIDScanResponse(
            success=False,
            message="Invalid RFID code. Employee not found."
        )
    
    # Check if already marked attendance today
    today = date.today()
    existing_attendance = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee.id,
            Attendance.attendance_date == today
        )
    ).first()
    
    if existing_attendance:
        return RFIDScanResponse(
            success=False,
            message=f"Attendance already marked for {employee.employee_name} today.",
            employee_name=employee.employee_name,
            checkin_time=existing_attendance.checkin_time
        )
    
    # Create attendance record
    now = datetime.now()
    attendance = Attendance(
        employee_id=employee.id,
        attendance_date=today,
        checkin_time=now,
        status=AttendanceStatus.PRESENT
    )
    
    db.add(attendance)
    
    # Create attendance log
    log = AttendanceLog(
        employee_id=employee.id,
        action="checkin"
    )
    db.add(log)
    
    db.commit()
    db.refresh(attendance)
    
    return RFIDScanResponse(
        success=True,
        message=f"Attendance marked successfully for {employee.employee_name}",
        employee_name=employee.employee_name,
        checkin_time=now
    )


@router.get("/", response_model=List[AttendanceResponse])
def get_attendance(
    skip: int = 0,
    limit: int = 100,
    date_filter: Optional[date] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    query = db.query(Attendance)
    
    if date_filter:
        query = query.filter(Attendance.attendance_date == date_filter)
    
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    
    attendance_records = query.offset(skip).limit(limit).all()
    return attendance_records


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    attendance_records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).order_by(Attendance.attendance_date.desc()).all()
    
    return attendance_records
