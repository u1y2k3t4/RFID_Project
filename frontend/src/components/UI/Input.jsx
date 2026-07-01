import React from 'react'
import { cn } from '../../utils/cn'

const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn('input-field', className)}
      {...props}
    />
  )
}

export default Input
