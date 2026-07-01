# AI-Powered Smart Attendance Analytics Platform

A complete enterprise-grade attendance management system with RFID simulation, real-time analytics, AI-powered insights, and comprehensive reporting.

## Features

### Core Features
- **Virtual RFID Attendance**: Simulate RFID scanning by entering RFID codes
- **Employee Management**: Full CRUD operations for employees
- **Real-Time Dashboard**: Live attendance statistics with WebSocket updates
- **AI Analytics**: Predictive analytics using scikit-learn
- **Comprehensive Reports**: PDF and CSV export capabilities
- **Role-Based Access**: Admin and Manager roles with JWT authentication
- **Dark Mode**: Modern UI with dark mode support

### Analytics Features
- Daily, Weekly, and Monthly attendance trends
- Department-wise attendance analysis
- Top and low performer identification
- AI-powered absence predictions
- Irregular pattern detection

### Reporting Features
- Daily attendance PDF reports
- Weekly attendance PDF reports
- Employee-specific reports
- CSV data export

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: WebSockets
- **AI/ML**: Pandas, NumPy, Scikit-learn
- **Reporting**: ReportLab

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
RFID_Project/
├── backend/
│   ├── app/
│   │   ├── analytics/       # AI analytics engine
│   │   ├── auth/            # Authentication & security
│   │   ├── models/          # Database models
│   │   ├── reports/         # PDF/CSV generation
│   │   ├── routers/         # API endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── websocket/       # WebSocket manager
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database connection
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── init_db.py           # Database initialization
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Charts/      # Chart components
│   │   │   ├── Layout/      # Layout components
│   │   │   └── UI/          # UI components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Installation Guide

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- SQLite (included with Python)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL=sqlite:///./attendance.db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

6. **Initialize database with sample data**
```bash
python init_db.py
```

This will create:
- Admin user: `admin` / `admin`
- Manager user: `manager` / `manager`
- 10 sample employees
- 30 days of sample attendance data

8. **Start backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at: http://localhost:8000
API Documentation (Swagger): http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Usage

### Login
- Use admin credentials: `admin` / `admin123`
- Or manager credentials: `manager` / `manager123`

### RFID Attendance Scanning
1. Navigate to "Attendance" page
2. Enter an RFID code (e.g., `RFID001`, `RFID002`, etc.)
3. Click "Scan" to mark attendance
4. System validates RFID and marks attendance

### Employee Management
1. Navigate to "Employees" page
2. Add, edit, or delete employees
3. Search employees by name, code, or email
4. Each employee has a unique RFID code

### Analytics Dashboard
- View real-time attendance statistics
- Analyze daily, weekly, and monthly trends
- Department-wise attendance breakdown

### AI Insights
- View AI-generated attendance summary
- Check predicted absences for tomorrow
- Identify top and low performers
- Detect irregular attendance patterns

### Reports
- Download daily attendance PDF
- Download weekly attendance PDF
- Export data to CSV
- Filter by date range

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Employees
- `GET /employees` - List all employees
- `POST /employees` - Create employee
- `GET /employees/{id}` - Get employee by ID
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

### Attendance
- `POST /attendance/scan` - Scan RFID code
- `GET /attendance` - List attendance records
- `GET /attendance/employee/{id}` - Get employee attendance

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/trends/daily` - Get daily trends
- `GET /dashboard/trends/weekly` - Get weekly trends
- `GET /dashboard/trends/monthly` - Get monthly trends

### Analytics
- `GET /analytics/summary` - Get AI summary
- `GET /analytics/predict/absent` - Predict absent employees
- `GET /analytics/predict/weekly` - Predict weekly attendance
- `GET /analytics/top-performers` - Get top performers
- `GET /analytics/low-performers` - Get low performers

### Reports
- `GET /reports/daily/pdf` - Download daily PDF
- `GET /reports/weekly/pdf` - Download weekly PDF
- `GET /reports/employee/{id}/pdf` - Download employee PDF
- `GET /reports/csv` - Export CSV

### WebSocket
- `WS /ws/dashboard` - Real-time dashboard updates

## Database Schema

### employees
- `id` (Primary Key)
- `employee_code` (Unique)
- `employee_name`
- `department`
- `email` (Unique)
- `rfid_code` (Unique)
- `created_at`

### attendance
- `id` (Primary Key)
- `employee_id` (Foreign Key)
- `attendance_date`
- `checkin_time`
- `status` (present/absent/late)

### attendance_logs
- `id` (Primary Key)
- `employee_id` (Foreign Key)
- `action`
- `timestamp`

### users
- `id` (Primary Key)
- `username` (Unique)
- `password_hash`
- `role` (admin/manager)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (React)

## Deployment Instructions

### Backend Deployment

1. **Set environment variables** in production
2. **Use a production WSGI server**:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```
3. **Configure PostgreSQL** with proper security
4. **Use HTTPS** in production
5. **Set strong SECRET_KEY**

### Frontend Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Deploy to hosting service** (Vercel, Netlify, etc.)
3. **Configure API proxy** if needed

## Troubleshooting

### Backend Issues
- **Database connection error**: SQLite database will be created automatically
- **Module not found**: Run `pip install -r requirements.txt`
- **Port already in use**: Change port in uvicorn command

### Frontend Issues
- **API connection error**: Ensure backend is running on port 8000
- **Module not found**: Run `npm install`
- **Build errors**: Clear node_modules and reinstall

## License

This project is for demonstration purposes.

## Support

For issues and questions, please refer to the API documentation at `/docs` endpoint.
