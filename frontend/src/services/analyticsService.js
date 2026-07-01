import api from './api'

export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/analytics/summary')
    return response.data
  },
  
  predictAbsent: async () => {
    const response = await api.get('/analytics/predict/absent')
    return response.data
  },
  
  predictWeekly: async () => {
    const response = await api.get('/analytics/predict/weekly')
    return response.data
  },
  
  getTopPerformers: async (limit = 10) => {
    const response = await api.get('/analytics/top-performers', { params: { limit } })
    return response.data
  },
  
  getLowPerformers: async (limit = 10) => {
    const response = await api.get('/analytics/low-performers', { params: { limit } })
    return response.data
  },
  
  getEmployeeAnalytics: async (employeeId) => {
    const response = await api.get(`/analytics/employee/${employeeId}`)
    return response.data
  }
}
