import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: IconName
  children: ReactNode
}

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
  return <button className={`btn-${variant} ${className}`.trim()} {...props}>
    {icon && <Icon name={icon} size={17} />}{children}
  </button>
}
