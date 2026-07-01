import React, { useState } from 'react'
import { Download, FileText, Calendar } from 'lucide-react'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import { reportService } from '../services/reportService'

const Reports = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownloadDailyPDF = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const text = await reportService.getDailyText(today)
      reportService.downloadText(text, `daily_attendance_${today}.txt`)
    } catch (error) {
      console.error('Error downloading daily report:', error)
      alert('Error downloading report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadWeeklyPDF = async () => {
    setLoading(true)
    try {
      const text = await reportService.getWeeklyText(startDate, endDate)
      const filename = startDate && endDate
        ? `weekly_attendance_${startDate}_to_${endDate}.txt`
        : 'weekly_attendance.txt'
      reportService.downloadText(text, filename)
    } catch (error) {
      console.error('Error downloading weekly report:', error)
      alert('Error downloading report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = async () => {
    setLoading(true)
    try {
      const blob = await reportService.exportCSV(startDate, endDate)
      const filename = startDate && endDate 
        ? `attendance_${startDate}_to_${endDate}.csv`
        : 'attendance_export.csv'
      reportService.downloadBlob(blob, filename)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Error downloading CSV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Date Range Filter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Report */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={28} className="text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's attendance summary</p>
            </div>
          </div>
          <Button
            onClick={handleDownloadDailyPDF}
            disabled={loading}
            className="w-full"
          >
            <Download size={20} className="mr-2" />
            Download Report
          </Button>
        </div>

        {/* Weekly Report */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={28} className="text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Weekly attendance summary</p>
            </div>
          </div>
          <Button
            onClick={handleDownloadWeeklyPDF}
            disabled={loading}
            className="w-full"
          >
            <Download size={20} className="mr-2" />
            Download Report
          </Button>
        </div>

        {/* CSV Export */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={28} className="text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CSV Export</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Raw data export</p>
            </div>
          </div>
          <Button
            onClick={handleDownloadCSV}
            disabled={loading}
            className="w-full"
          >
            <Download size={20} className="mr-2" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Instructions</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span><strong>Daily Report:</strong> Generates a text report for today's attendance with summary statistics and detailed records.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span><strong>Weekly Report:</strong> Generates a text report for a date range. Use the date filter above to specify the range.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span><strong>CSV Export:</strong> Exports raw attendance data to CSV format for further analysis in Excel or other tools.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span><strong>Date Filter:</strong> Optional - if not specified, weekly reports use the current week and CSV exports all data.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Reports
