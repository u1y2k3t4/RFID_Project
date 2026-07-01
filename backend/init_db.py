"""
Database initialization script
Creates initial admin user and sample data
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Employee, Attendance, AttendanceLog, User, UserRole
from app.auth.security import get_password_hash
from datetime import date, datetime, timedelta
import random

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin"),
                role=UserRole.ADMIN
            )
            db.add(admin)
            print("Created admin user: admin / admin")

        # Create manager user
        manager = db.query(User).filter(User.username == "manager").first()
        if not manager:
            manager = User(
                username="manager",
                password_hash=get_password_hash("manager"),
                role=UserRole.MANAGER
            )
            db.add(manager)
            print("Created manager user: manager / manager")
        
        # Create sample employees
        departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"]
        sample_employees = [
            {
                "employee_code": "EMP001",
                "employee_name": "John Smith",
                "department": "Engineering",
                "email": "john.smith@company.com",
                "rfid_code": "RFID001"
            },
            {
                "employee_code": "EMP002",
                "employee_name": "Jane Doe",
                "department": "Marketing",
                "email": "jane.doe@company.com",
                "rfid_code": "RFID002"
            },
            {
                "employee_code": "EMP003",
                "employee_name": "Bob Johnson",
                "department": "Sales",
                "email": "bob.johnson@company.com",
                "rfid_code": "RFID003"
            },
            {
                "employee_code": "EMP004",
                "employee_name": "Alice Williams",
                "department": "Engineering",
                "email": "alice.williams@company.com",
                "rfid_code": "RFID004"
            },
            {
                "employee_code": "EMP005",
                "employee_name": "Charlie Brown",
                "department": "HR",
                "email": "charlie.brown@company.com",
                "rfid_code": "RFID005"
            },
            {
                "employee_code": "EMP006",
                "employee_name": "Diana Prince",
                "department": "Finance",
                "email": "diana.prince@company.com",
                "rfid_code": "RFID006"
            },
            {
                "employee_code": "EMP007",
                "employee_name": "Eve Davis",
                "department": "Marketing",
                "email": "eve.davis@company.com",
                "rfid_code": "RFID007"
            },
            {
                "employee_code": "EMP008",
                "employee_name": "Frank Miller",
                "department": "Sales",
                "email": "frank.miller@company.com",
                "rfid_code": "RFID008"
            },
            {
                "employee_code": "EMP009",
                "employee_name": "Grace Lee",
                "department": "Engineering",
                "email": "grace.lee@company.com",
                "rfid_code": "RFID009"
            },
            {
                "employee_code": "EMP010",
                "employee_name": "Henry Wilson",
                "department": "HR",
                "email": "henry.wilson@company.com",
                "rfid_code": "RFID010"
            }
        ]
        
        for emp_data in sample_employees:
            existing = db.query(Employee).filter(Employee.rfid_code == emp_data["rfid_code"]).first()
            if not existing:
                employee = Employee(**emp_data)
                db.add(employee)
        
        db.commit()
        print("Created sample employees")
        
        # Create sample attendance data for the last 30 days
        employees = db.query(Employee).all()
        today = date.today()
        
        for days_ago in range(30, 0, -1):
            attendance_date = today - timedelta(days=days_ago)
            
            # Skip weekends
            if attendance_date.weekday() >= 5:
                continue
            
            for employee in employees:
                # Random attendance with 85% present rate
                if random.random() < 0.85:
                    checkin_time = datetime.combine(
                        attendance_date,
                        datetime.min.time()
                    ) + timedelta(hours=random.randint(8, 10), minutes=random.randint(0, 59))
                    
                    attendance = Attendance(
                        employee_id=employee.id,
                        attendance_date=attendance_date,
                        checkin_time=checkin_time,
                        status="present"
                    )
                    db.add(attendance)
        
        db.commit()
        print("Created sample attendance data for the last 30 days")
        
        print("\nDatabase initialization completed successfully!")
        print("\nLogin credentials:")
        print("Admin: username='admin', password='admin'")
        print("Manager: username='manager', password='manager'")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
