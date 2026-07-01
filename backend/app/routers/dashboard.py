from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, datetime, timedelta
from typing import List, Dict, Any
from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.auth.dependencies import get_current_manager_or_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    today = date.today()
    
    # Total employees
    total_employees = db.query(Employee).count()
    
    # Present today
    present_today = db.query(Attendance).filter(
        Attendance.attendance_date == today
    ).count()
    
    # Absent today
    absent_today = total_employees - present_today
    
    # Attendance percentage
    attendance_percentage = (present_today / total_employees * 100) if total_employees > 0 else 0
    
    # Department-wise attendance
    departments = db.query(Employee.department).distinct().all()
    department_stats = []
    
    for dept in departments:
        dept_name = dept[0]
        dept_total = db.query(Employee).filter(Employee.department == dept_name).count()
        dept_present = db.query(Attendance).join(Employee).filter(
            and_(
                Attendance.attendance_date == today,
                Employee.department == dept_name
            )
        ).count()
        
        department_stats.append({
            "department": dept_name,
            "total": dept_total,
            "present": dept_present,
            "absent": dept_total - dept_present,
            "percentage": (dept_present / dept_total * 100) if dept_total > 0 else 0
        })
    
    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "attendance_percentage": round(attendance_percentage, 2),
        "department_stats": department_stats,
        "date": today.isoformat()
    }


@router.get("/trends/daily")
def get_daily_trends(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    trends = []
    end_date = date.today()
    start_date = end_date - timedelta(days=days-1)
    
    total_employees = db.query(Employee).count()
    
    current_date = start_date
    while current_date <= end_date:
        present_count = db.query(Attendance).filter(
            Attendance.attendance_date == current_date
        ).count()
        
        trends.append({
            "date": current_date.isoformat(),
            "present": present_count,
            "absent": total_employees - present_count,
            "percentage": (present_count / total_employees * 100) if total_employees > 0 else 0
        })
        
        current_date += timedelta(days=1)
    
    return trends


@router.get("/trends/weekly")
def get_weekly_trends(
    weeks: int = 4,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    trends = []
    end_date = date.today()
    
    for week in range(weeks):
        week_end = end_date - timedelta(weeks=week)
        week_start = week_end - timedelta(days=6)
        
        present_count = db.query(Attendance).filter(
            and_(
                Attendance.attendance_date >= week_start,
                Attendance.attendance_date <= week_end
            )
        ).count()
        
        total_employees = db.query(Employee).count()
        
        trends.append({
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "present": present_count,
            "percentage": (present_count / (total_employees * 7) * 100) if total_employees > 0 else 0
        })
    
    return trends[::-1]  # Reverse to show oldest first


@router.get("/trends/monthly")
def get_monthly_trends(
    months: int = 6,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    trends = []
    end_date = date.today()
    
    for month in range(months):
        month_end = end_date.replace(day=1) - timedelta(days=1)
        month_start = month_end.replace(day=1)
        
        present_count = db.query(Attendance).filter(
            and_(
                Attendance.attendance_date >= month_start,
                Attendance.attendance_date <= month_end
            )
        ).count()
        
        total_employees = db.query(Employee).count()
        working_days = 22  # Approximate working days per month
        
        trends.append({
            "month": month_start.strftime("%Y-%m"),
            "present": present_count,
            "percentage": (present_count / (total_employees * working_days) * 100) if total_employees > 0 else 0
        })
        
        end_date = month_start
    
    return trends[::-1]
