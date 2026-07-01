from datetime import date, datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.attendance import Attendance


class AttendanceAnalyticsEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_attendance_data(self) -> List[Dict]:
        """Fetch attendance data"""
        query = self.db.query(
            Attendance.employee_id,
            Attendance.attendance_date,
            Attendance.status
        ).all()

        data = []
        for record in query:
            data.append({
                'employee_id': record.employee_id,
                'date': record.attendance_date,
                'status': 1 if record.status == 'present' else 0
            })

        return data
    
    def get_employee_features(self, employee_id: int) -> Dict[str, Any]:
        """Extract features for a specific employee"""
        employee = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return {}
        
        # Get attendance history
        attendance_records = self.db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).order_by(Attendance.attendance_date.desc()).limit(30).all()
        
        if len(attendance_records) < 5:
            return {"error": "Insufficient data"}
        
        # Calculate features
        present_days = sum(1 for a in attendance_records if a.status == 'present')
        attendance_rate = present_days / len(attendance_records)
        
        # Check for irregular patterns
        dates = [a.attendance_date for a in attendance_records]
        date_gaps = []
        for i in range(len(dates) - 1):
            gap = (dates[i] - dates[i + 1]).days
            date_gaps.append(gap)

        avg_gap = sum(date_gaps) / len(date_gaps) if date_gaps else 0
        irregular_pattern = any(gap > 3 for gap in date_gaps)
        
        return {
            "employee_id": employee_id,
            "employee_name": employee.employee_name,
            "department": employee.department,
            "attendance_rate": round(attendance_rate * 100, 2),
            "total_records": len(attendance_records),
            "avg_gap_between_attendance": round(avg_gap, 2),
            "has_irregular_pattern": irregular_pattern
        }
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate attendance summary with insights"""
        today = date.today()
        
        # Today's stats
        total_employees = self.db.query(Employee).count()
        present_today = self.db.query(Attendance).filter(
            Attendance.attendance_date == today
        ).count()
        
        attendance_rate = (present_today / total_employees * 100) if total_employees > 0 else 0
        
        # Find employees with irregular patterns
        all_employees = self.db.query(Employee).all()
        irregular_employees = []
        
        for employee in all_employees:
            features = self.get_employee_features(employee.id)
            if features.get("has_irregular_pattern", False):
                irregular_employees.append({
                    "name": features["employee_name"],
                    "attendance_rate": features["attendance_rate"]
                })
        
        summary = {
            "date": today.isoformat(),
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": total_employees - present_today,
            "attendance_rate": round(attendance_rate, 2),
            "irregular_employees_count": len(irregular_employees),
            "irregular_employees": irregular_employees[:5],  # Top 5
            "insight": self._generate_insight(present_today, total_employees, len(irregular_employees))
        }
        
        return summary
    
    def _generate_insight(self, present: int, total: int, irregular_count: int) -> str:
        """Generate natural language insight"""
        rate = (present / total * 100) if total > 0 else 0
        
        if rate >= 90:
            status = "excellent"
        elif rate >= 80:
            status = "good"
        elif rate >= 70:
            status = "moderate"
        else:
            status = "concerning"
        
        insight = f"Today {present} of {total} employees were present. Attendance rate is {rate:.1f}%, which is {status}."
        
        if irregular_count > 0:
            insight += f" {irregular_count} employees have irregular attendance patterns."
        
        return insight
    
    def predict_absent_employees(self) -> List[Dict[str, Any]]:
        """Predict employees likely to be absent tomorrow"""
        predictions = []
        
        employees = self.db.query(Employee).all()
        for employee in employees:
            features = self.get_employee_features(employee.id)
            
            if features.get("error"):
                continue
            
            # Simple prediction based on attendance rate and patterns
            attendance_rate = features["attendance_rate"]
            has_irregular = features["has_irregular_pattern"]
            
            # Predict absent if attendance rate is low or has irregular patterns
            likelihood = 0
            if attendance_rate < 70:
                likelihood = 0.7
            elif attendance_rate < 80:
                likelihood = 0.4
            elif has_irregular:
                likelihood = 0.3
            
            if likelihood > 0.3:
                predictions.append({
                    "employee_id": employee.id,
                    "employee_name": features["employee_name"],
                    "department": features["department"],
                    "attendance_rate": attendance_rate,
                    "absence_likelihood": round(likelihood * 100, 2)
                })
        
        # Sort by likelihood
        predictions.sort(key=lambda x: x["absence_likelihood"], reverse=True)
        return predictions[:10]  # Top 10 predictions
    
    def predict_weekly_attendance(self) -> Dict[str, Any]:
        """Predict attendance percentage for next week"""
        # Get last 4 weeks data
        today = date.today()
        four_weeks_ago = today - timedelta(weeks=4)
        
        recent_attendance = self.db.query(Attendance).filter(
            Attendance.attendance_date >= four_weeks_ago
        ).all()
        
        if not recent_attendance:
            return {"error": "Insufficient historical data"}
        
        # Calculate average attendance rate
        total_employees = self.db.query(Employee).count()
        total_possible_attendance = total_employees * 28  # 4 weeks * 7 days
        actual_attendance = len(recent_attendance)
        
        historical_rate = (actual_attendance / total_possible_attendance * 100) if total_possible_attendance > 0 else 0
        
        # Predict next week (slight adjustment based on trend)
        predicted_rate = historical_rate  # Can be enhanced with trend analysis
        
        return {
            "historical_rate": round(historical_rate, 2),
            "predicted_rate": round(predicted_rate, 2),
            "confidence": "moderate",
            "week_start": (today + timedelta(days=1)).isoformat(),
            "week_end": (today + timedelta(days=7)).isoformat()
        }
    
    def get_top_performers(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get employees with highest attendance"""
        performers = []
        
        employees = self.db.query(Employee).all()
        for employee in employees:
            features = self.get_employee_features(employee.id)
            if not features.get("error"):
                performers.append({
                    "employee_id": employee.id,
                    "employee_name": features["employee_name"],
                    "department": features["department"],
                    "attendance_rate": features["attendance_rate"]
                })
        
        performers.sort(key=lambda x: x["attendance_rate"], reverse=True)
        return performers[:limit]
    
    def get_low_performers(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get employees with lowest attendance"""
        performers = []
        
        employees = self.db.query(Employee).all()
        for employee in employees:
            features = self.get_employee_features(employee.id)
            if not features.get("error"):
                performers.append({
                    "employee_id": employee.id,
                    "employee_name": features["employee_name"],
                    "department": features["department"],
                    "attendance_rate": features["attendance_rate"]
                })
        
        performers.sort(key=lambda x: x["attendance_rate"])
        return performers[:limit]
