import api from './api'

export const employeeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },
  
  create: async (employeeData) => {
    const response = await api.post('/employees', employeeData)
    return response.data
  },
  
  update: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data
  },
  
  delete: async (id) => {
    await api.delete(`/employees/${id}`)
  }
}
