import api from './api'

export const reportService = {
  getDailyText: async (date) => {
    const response = await api.get('/reports/daily/text', {
      params: { report_date: date },
      responseType: 'text'
    })
    return response.data
  },

  getWeeklyText: async (startDate, endDate) => {
    const response = await api.get('/reports/weekly/text', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'text'
    })
    return response.data
  },

  getEmployeeText: async (employeeId) => {
    const response = await api.get(`/reports/employee/${employeeId}/text`, {
      responseType: 'text'
    })
    return response.data
  },
  
  exportCSV: async (startDate, endDate) => {
    const response = await api.get('/reports/csv', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob'
    })
    return response.data
  },
  
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  downloadText: (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}
