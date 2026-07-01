import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import Modal from '../components/UI/Modal'
import Table from '../components/UI/Table'
import { employeeService } from '../services/employeeService'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    employee_code: '',
    employee_name: '',
    department: '',
    email: '',
    rfid_code: ''
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData)
      } else {
        await employeeService.create(formData)
      }
      setIsModalOpen(false)
      setEditingEmployee(null)
      setFormData({
        employee_code: '',
        employee_name: '',
        department: '',
        email: '',
        rfid_code: ''
      })
      fetchEmployees()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Error saving employee. Please check if the code/email already exists.')
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employee_code: employee.employee_code,
      employee_name: employee.employee_name,
      department: employee.department,
      email: employee.email,
      rfid_code: employee.rfid_code
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id)
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setFormData({
      employee_code: '',
      employee_name: '',
      department: '',
      email: '',
      rfid_code: ''
    })
    setIsModalOpen(true)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'employee_code', label: 'Employee Code' },
    { key: 'employee_name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'email', label: 'Email' },
    { key: 'rfid_code', label: 'RFID Code' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddNew}>
          <Plus size={20} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="card">
        <Table columns={columns} data={filteredEmployees} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee Code
            </label>
            <Input
              type="text"
              value={formData.employee_code}
              onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
              required
              disabled={!!editingEmployee}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee Name
            </label>
            <Input
              type="text"
              value={formData.employee_name}
              onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <Input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RFID Code
            </label>
            <Input
              type="text"
              value={formData.rfid_code}
              onChange={(e) => setFormData({ ...formData, rfid_code: e.target.value })}
              required
              disabled={!!editingEmployee}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingEmployee ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Employees
