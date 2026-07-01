import React, { useState, useEffect } from 'react'
import LineChart from '../components/Charts/LineChart'
import BarChart from '../components/Charts/BarChart'
import { dashboardService } from '../services/dashboardService'

const Analytics = () => {
  const [dailyTrends, setDailyTrends] = useState([])
  const [weeklyTrends, setWeeklyTrends] = useState([])
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const [daily, weekly, monthly] = await Promise.all([
        dashboardService.getDailyTrends(30),
        dashboardService.getWeeklyTrends(12),
        dashboardService.getMonthlyTrends(12)
      ])
      setDailyTrends(daily)
      setWeeklyTrends(weekly)
      setMonthlyTrends(monthly)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Attendance Trend (30 Days)
          </h3>
          <LineChart
            data={dailyTrends}
            dataKey="date"
            lines={[
              { key: 'present', color: '#10b981', name: 'Present' },
              { key: 'absent', color: '#ef4444', name: 'Absent' }
            ]}
          />
        </div>

        {/* Weekly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Attendance Trend (12 Weeks)
          </h3>
          <BarChart
            data={weeklyTrends}
            dataKey="week_start"
            bars={[
              { key: 'present', color: '#3b82f6', name: 'Present' }
            ]}
          />
        </div>

        {/* Monthly Trends */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Attendance Trend (12 Months)
          </h3>
          <LineChart
            data={monthlyTrends}
            dataKey="month"
            lines={[
              { key: 'present', color: '#8b5cf6', name: 'Present' }
            ]}
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Summary Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">30-Day Average</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">
              {dailyTrends.length > 0 ? (dailyTrends.reduce((a, b) => a + b.percentage, 0) / dailyTrends.length).toFixed(1) : 0}%
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Best Day</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-2">
              {dailyTrends.length > 0 ? Math.max(...dailyTrends.map(d => d.percentage)).toFixed(1) : 0}%
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Lowest Day</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-2">
              {dailyTrends.length > 0 ? Math.min(...dailyTrends.map(d => d.percentage)).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
