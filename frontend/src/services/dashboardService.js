import api from './api'

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
  
  getDailyTrends: async (days = 7) => {
    const response = await api.get('/dashboard/trends/daily', { params: { days } })
    return response.data
  },
  
  getWeeklyTrends: async (weeks = 4) => {
    const response = await api.get('/dashboard/trends/weekly', { params: { weeks } })
    return response.data
  },
  
  getMonthlyTrends: async (months = 6) => {
    const response = await api.get('/dashboard/trends/monthly', { params: { months } })
    return response.data
  }
}
