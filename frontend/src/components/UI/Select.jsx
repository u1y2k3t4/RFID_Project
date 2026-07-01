import React from 'react'
import { cn } from '../../utils/cn'

const Select = ({ children, className, ...props }) => {
  return (
    <select
      className={cn('input-field', className)}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select
