import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function DumbbellIcon({ className, name = 'dumbbell', ...props }: IconProps) {
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
      <path d="m6.5 6.5 11 11" />
      <path d="M21 16 16 21" />
      <path d="M3 21 8 16" />
      <path d="M21 8l-5-5" />
      <path d="M3 8l5-5" />
      <path d="M21 16v5h-5" />
      <path d="M3 16v5h5" />
      <path d="M21 8V3h-5" />
      <path d="M3 8V3h5" />
    </svg>
  )
}
