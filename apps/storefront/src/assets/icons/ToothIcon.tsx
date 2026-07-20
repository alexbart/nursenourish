import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function ToothIcon({ className, name = 'tooth', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={name}
      role="img"
      {...props}
    >
      <path d="M12 2c0 0-1 2-2 4s-1.5 4.5-1.5 4.5-.5 2.5-.5 3.5 1 3 1 3h4s1-1.5 1-3 0-3.5 0-3.5S14 6 14 6s-1-2-2-4" />
      <path d="M12 2c0 0 1 2 2 4s1.5 4.5 1.5 4.5.5 2.5.5 3.5-1 3-1 3h-4s-1-1.5-1-3 0-3.5 0-3.5S10 6 10 6s1-2 2-4" />
    </svg>
  )
}
