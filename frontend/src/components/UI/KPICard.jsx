import React from 'react'
import { cn } from '../../utils/cn'

const KPICard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colors[color])}>
          {Icon && <Icon size={24} className="text-white" />}
        </div>
      </div>
    </div>
  )
}

export default KPICard
