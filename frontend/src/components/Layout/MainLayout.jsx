import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const MainLayout = () => {
  const getTitle = () => {
    const path = window.location.pathname
    const titles = {
      '/dashboard': 'Dashboard',
      '/employees': 'Employee Management',
      '/attendance': 'Attendance Tracking',
      '/analytics': 'Analytics Dashboard',
      '/insights': 'AI Insights',
      '/reports': 'Reports',
    }
    return titles[path] || 'Dashboard'
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={getTitle()} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
