import api from './api'

export const attendanceService = {
  scanRFID: async (rfidCode) => {
    const response = await api.post('/attendance/scan', { rfid_code: rfidCode })
    return response.data
  },
  
  getAll: async (params = {}) => {
    const response = await api.get('/attendance', { params })
    return response.data
  },
  
  getByEmployee: async (employeeId) => {
    const response = await api.get(`/attendance/employee/${employeeId}`)
    return response.data
  }
}
