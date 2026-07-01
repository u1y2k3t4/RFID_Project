from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.analytics.engine import AttendanceAnalyticsEngine
from app.auth.dependencies import get_current_manager_or_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_attendance_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.generate_summary()


@router.get("/predict/absent")
def predict_absent_employees(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.predict_absent_employees()


@router.get("/predict/weekly")
def predict_weekly_attendance(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.predict_weekly_attendance()


@router.get("/top-performers")
def get_top_performers(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.get_top_performers(limit)


@router.get("/low-performers")
def get_low_performers(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.get_low_performers(limit)


@router.get("/employee/{employee_id}")
def get_employee_analytics(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    engine = AttendanceAnalyticsEngine(db)
    return engine.get_employee_features(employee_id)
