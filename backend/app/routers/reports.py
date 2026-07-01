from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from app.database import get_db
from app.reports.generator import ReportGenerator
from app.auth.dependencies import get_current_manager_or_admin

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/daily/text")
def get_daily_report_text(
    report_date: date = Query(default=date.today()),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    generator = ReportGenerator(db)
    text_content = generator.generate_daily_report(report_date)

    return Response(
        content=text_content,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=daily_attendance_{report_date}.txt"
        }
    )


@router.get("/weekly/text")
def get_weekly_report_text(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    if not start_date:
        start_date = date.today() - timedelta(days=date.today().weekday())
    if not end_date:
        end_date = start_date + timedelta(days=6)

    generator = ReportGenerator(db)
    text_content = generator.generate_weekly_report(start_date, end_date)

    return Response(
        content=text_content,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=weekly_attendance_{start_date}_to_{end_date}.txt"
        }
    )


@router.get("/employee/{employee_id}/text")
def get_employee_report_text(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    generator = ReportGenerator(db)
    text_content = generator.generate_employee_report(employee_id)

    if not text_content:
        raise HTTPException(status_code=404, detail="Employee not found")

    return Response(
        content=text_content,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=employee_{employee_id}_attendance.txt"
        }
    )


@router.get("/csv")
def export_attendance_csv(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_manager_or_admin)
):
    generator = ReportGenerator(db)
    csv_content = generator.export_to_csv(start_date, end_date)
    
    filename = "attendance_export"
    if start_date and end_date:
        filename = f"attendance_{start_date}_to_{end_date}"
    elif start_date:
        filename = f"attendance_from_{start_date}"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}.csv"
        }
    )
