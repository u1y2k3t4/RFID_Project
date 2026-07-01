import React, { useState, useEffect } from 'react'
import { ScanLine, CheckCircle, XCircle, Clock } from 'lucide-react'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import { attendanceService } from '../services/attendanceService'

const Attendance = () => {
  const [rfidCode, setRfidCode] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recentScans, setRecentScans] = useState([])

  const handleScan = async (e) => {
    e.preventDefault()
    if (!rfidCode.trim()) return

    setLoading(true)
    try {
      const result = await attendanceService.scanRFID(rfidCode)
      setScanResult(result)
      
      if (result.success) {
        setRecentScans([
          {
            employee_name: result.employee_name,
            checkin_time: result.checkin_time,
            status: 'success'
          },
          ...recentScans.slice(0, 4)
        ])
        setRfidCode('')
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: 'Error scanning RFID code'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* RFID Scanner */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <ScanLine size={32} className="text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">RFID Attendance Scanner</h2>
            <p className="text-gray-600 dark:text-gray-400">Enter RFID code to mark attendance</p>
          </div>
        </div>

        <form onSubmit={handleScan} className="flex gap-4">
          <Input
            type="text"
            value={rfidCode}
            onChange={(e) => setRfidCode(e.target.value)}
            placeholder="Enter RFID code..."
            className="flex-1 text-lg"
            autoFocus
          />
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? 'Scanning...' : 'Scan'}
          </Button>
        </form>

        {scanResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              scanResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {scanResult.success ? (
                <CheckCircle size={24} className="text-green-600" />
              ) : (
                <XCircle size={24} className="text-red-600" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    scanResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}
                >
                  {scanResult.success ? 'Success!' : 'Error'}
                </p>
                <p className={scanResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  {scanResult.message}
                </p>
                {scanResult.employee_name && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Employee: {scanResult.employee_name}
                  </p>
                )}
                {scanResult.checkin_time && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Time: {new Date(scanResult.checkin_time).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} />
            Recent Scans
          </h3>
          <div className="space-y-3">
            {recentScans.map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{scan.employee_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(scan.checkin_time).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Present</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            Enter the RFID code in the input field above
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            Click "Scan" or press Enter to mark attendance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            Duplicate attendance on the same day will be prevented
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            Invalid RFID codes will show an error message
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Attendance
