import React, { useState, useEffect } from 'react'
import { Brain, TrendingDown, AlertTriangle, Award } from 'lucide-react'
import { analyticsService } from '../services/analyticsService'

const Insights = () => {
  const [summary, setSummary] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [weeklyPrediction, setWeeklyPrediction] = useState(null)
  const [topPerformers, setTopPerformers] = useState([])
  const [lowPerformers, setLowPerformers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsightsData()
  }, [])

  const fetchInsightsData = async () => {
    try {
      const [summaryData, predictionsData, weeklyData, topData, lowData] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.predictAbsent(),
        analyticsService.predictWeekly(),
        analyticsService.getTopPerformers(5),
        analyticsService.getLowPerformers(5)
      ])
      setSummary(summaryData)
      setPredictions(predictionsData)
      setWeeklyPrediction(weeklyData)
      setTopPerformers(topData)
      setLowPerformers(lowData)
    } catch (error) {
      console.error('Error fetching insights data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading AI Insights...</div>
  }

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      {summary && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Brain size={28} className="text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Attendance Summary</h2>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-lg text-purple-900 dark:text-purple-300">{summary.insight}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_employees}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{summary.present_today}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Present Today</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.attendance_rate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{summary.irregular_employees_count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Irregular Patterns</p>
            </div>
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absence Predictions */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={24} className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Predicted Absences (Tomorrow)
            </h3>
          </div>
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((pred, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{pred.employee_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pred.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{pred.absence_likelihood}%</p>
                    <p className="text-xs text-gray-500">Likelihood</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No high-risk employees identified</p>
          )}
        </div>

        {/* Weekly Prediction */}
        {weeklyPrediction && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={24} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Attendance Prediction
            </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Predicted Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                  {weeklyPrediction.predicted_rate}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Historical Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weeklyPrediction.historical_rate}%
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Week: {weeklyPrediction.week_start} to {weeklyPrediction.week_end}</p>
                <p className="mt-1">Confidence: {weeklyPrediction.confidence}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Award size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{performer.employee_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{performer.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{performer.attendance_rate}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Performers */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={24} className="text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Needs Attention</h3>
          </div>
          <div className="space-y-3">
            {lowPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{performer.employee_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{performer.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">{performer.attendance_rate}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights
