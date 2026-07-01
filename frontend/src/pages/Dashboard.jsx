import React, { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react'
import KPICard from '../components/UI/KPICard'
import BarChart from '../components/Charts/BarChart'
import PieChart from '../components/Charts/PieChart'
import { dashboardService } from '../services/dashboardService'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [dailyTrends, setDailyTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, trendsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getDailyTrends(7)
      ])
      setStats(statsData)
      setDailyTrends(trendsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Error loading dashboard data</div>
  }

  const departmentData = stats.department_stats.map(dept => ({
    name: dept.department,
    present: dept.present,
    absent: dept.absent
  }))

  const pieData = [
    { name: 'Present', value: stats.present_today },
    { name: 'Absent', value: stats.absent_today }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Employees"
          value={stats.total_employees}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Present Today"
          value={stats.present_today}
          icon={UserCheck}
          color="green"
        />
        <KPICard
          title="Absent Today"
          value={stats.absent_today}
          icon={UserX}
          color="red"
        />
        <KPICard
          title="Attendance Rate"
          value={`${stats.attendance_percentage}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Attendance Trend (Last 7 Days)
          </h3>
          <BarChart
            data={dailyTrends}
            dataKey="date"
            bars={[
              { key: 'present', color: '#10b981', name: 'Present' },
              { key: 'absent', color: '#ef4444', name: 'Absent' }
            ]}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Attendance Distribution
          </h3>
          <PieChart data={pieData} />
        </div>
      </div>

      {/* Department Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Department-wise Attendance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.department_stats.map((dept, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{dept.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{dept.total}</td>
                  <td className="py-3 px-4 text-sm text-green-600">{dept.present}</td>
                  <td className="py-3 px-4 text-sm text-red-600">{dept.absent}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{dept.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
