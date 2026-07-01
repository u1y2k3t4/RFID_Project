from datetime import date, datetime
from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.attendance import Attendance
from typing import Optional, List
import csv
import io


class ReportGenerator:
    def __init__(self, db: Session):
        self.db = db

    def generate_daily_report(self, report_date: date) -> str:
        """Generate daily attendance text report"""
        attendance_records = self.db.query(Attendance).filter(
            Attendance.attendance_date == report_date
        ).all()

        total_employees = self.db.query(Employee).count()
        present_count = len(attendance_records)
        absent_count = total_employees - present_count
        attendance_rate = (present_count / total_employees * 100) if total_employees > 0 else 0

        report = f"""
Daily Attendance Report - {report_date}
{'=' * 50}

Summary:
- Total Employees: {total_employees}
- Present: {present_count}
- Absent: {absent_count}
- Attendance Rate: {attendance_rate:.2f}%

Attendance Details:
{'-' * 50}
"""
        for record in attendance_records:
            employee = self.db.query(Employee).filter(Employee.id == record.employee_id).first()
            if employee:
                report += f"{employee.employee_code} | {employee.employee_name} | {employee.department} | {record.checkin_time.strftime('%H:%M:%S') if record.checkin_time else 'N/A'} | {record.status.value}\n"

        return report
    
    def generate_weekly_report(self, start_date: date, end_date: date) -> str:
        """Generate weekly attendance text report"""
        attendance_records = self.db.query(Attendance).filter(
            Attendance.attendance_date >= start_date,
            Attendance.attendance_date <= end_date
        ).all()

        total_employees = self.db.query(Employee).count()
        total_possible = total_employees * 7
        actual_attendance = len(attendance_records)
        attendance_rate = (actual_attendance / total_possible * 100) if total_possible > 0 else 0

        report = f"""
Weekly Attendance Report ({start_date} to {end_date})
{'=' * 50}

Summary:
- Total Employees: {total_employees}
- Total Present Records: {actual_attendance}
- Attendance Rate: {attendance_rate:.2f}%

Daily Breakdown:
{'-' * 50}
"""
        current_date = start_date
        while current_date <= end_date:
            day_present = self.db.query(Attendance).filter(
                Attendance.attendance_date == current_date
            ).count()
            day_absent = total_employees - day_present
            day_rate = (day_present / total_employees * 100) if total_employees > 0 else 0

            report += f"{current_date.strftime('%Y-%m-%d')} | Present: {day_present} | Absent: {day_absent} | Rate: {day_rate:.1f}%\n"
            current_date += timedelta(days=1)

        return report

    def generate_employee_report(self, employee_id: int) -> str:
        """Generate individual employee attendance text report"""
        employee = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return ""

        attendance_records = self.db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).order_by(Attendance.attendance_date.desc()).limit(30).all()

        report = f"""
Employee Attendance Report - {employee.employee_name}
{'=' * 50}

Employee Information:
- Employee Code: {employee.employee_code}
- Name: {employee.employee_name}
- Department: {employee.department}
- Email: {employee.email or 'N/A'}

Attendance History (Last 30 Records):
{'-' * 50}
"""
        for record in attendance_records:
            report += f"{record.attendance_date.strftime('%Y-%m-%d')} | {record.checkin_time.strftime('%H:%M:%S') if record.checkin_time else 'N/A'} | {record.status.value}\n"

        return report
    
    def export_to_csv(self, start_date: Optional[date] = None, end_date: Optional[date] = None) -> str:
        """Export attendance data to CSV"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Employee Code', 'Employee Name', 'Department', 'Date', 'Check-in Time', 'Status'])
        
        # Build query
        query = self.db.query(Attendance)
        
        if start_date:
            query = query.filter(Attendance.attendance_date >= start_date)
        if end_date:
            query = query.filter(Attendance.attendance_date <= end_date)
        
        attendance_records = query.all()
        
        # Write data
        for record in attendance_records:
            employee = self.db.query(Employee).filter(Employee.id == record.employee_id).first()
            if employee:
                writer.writerow([
                    employee.employee_code,
                    employee.employee_name,
                    employee.department,
                    record.attendance_date.strftime('%Y-%m-%d'),
                    record.checkin_time.strftime('%H:%M:%S') if record.checkin_time else 'N/A',
                    record.status.value
                ])
        
        return output.getvalue()
