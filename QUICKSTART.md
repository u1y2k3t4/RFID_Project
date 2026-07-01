# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- SQLite (included with Python)

## Step 1: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed (SQLite is configured by default)

# Initialize database with sample data
python init_db.py

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: http://localhost:8000
API Docs: http://localhost:8000/docs

## Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

## Step 3: Login

Open http://localhost:5173 in your browser

**Admin credentials:**
- Username: `admin`
- Password: `admin`

**Manager credentials:**
- Username: `manager`
- Password: `manager`

## Step 4: Test RFID Scanning

1. Login to the application
2. Navigate to "Attendance" page
3. Enter RFID code: `RFID001`
4. Click "Scan"
5. You should see a success message

## Sample RFID Codes
- RFID001 - John Smith (Engineering)
- RFID002 - Jane Doe (Marketing)
- RFID003 - Bob Johnson (Sales)
- RFID004 - Alice Williams (Engineering)
- RFID005 - Charlie Brown (HR)
- RFID006 - Diana Prince (Finance)
- RFID007 - Eve Davis (Marketing)
- RFID008 - Frank Miller (Sales)
- RFID009 - Grace Lee (Engineering)
- RFID010 - Henry Wilson (HR)

## Troubleshooting

**Backend won't start:**
- SQLite database will be created automatically
- Verify DATABASE_URL in .env
- Ensure port 8000 is not in use

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check CORS configuration in backend .env

## Next Steps

1. Explore the Dashboard for real-time statistics
2. Add new employees in the Employees section
3. View analytics trends and AI insights
4. Generate and download reports
5. Try dark mode toggle

For detailed documentation, see README.md
