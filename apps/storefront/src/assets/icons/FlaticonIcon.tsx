import { type SVGProps } from 'react'

export interface FlaticonIconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function FlaticonIcon({ name = 'icon', className, children, ...props }: FlaticonIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={name}
      role="img"
      {...props}
    >
      {children}
    </svg>
  )
}
