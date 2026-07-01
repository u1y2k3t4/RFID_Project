import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, ScanLine, BarChart3, Brain, FileText, LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/attendance', icon: ScanLine, label: 'Attendance' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/insights', icon: Brain, label: 'AI Insights' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Attendance AI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Smart Analytics Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>

        <div className="px-4 py-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
