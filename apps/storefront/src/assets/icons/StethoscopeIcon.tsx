import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function StethoscopeIcon({ className, name = 'stethoscope', ...props }: IconProps) {
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
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a5 5 0 0 0 5-5 2 2 0 1 0-4 0" />
      <path d="M15.7 8.8A2.5 2.5 0 0 0 15 12v5a5 5 0 0 1-5 5h0" />
      <path d="M20 15v4a2 2 0 0 1-2 2" />
      <path d="M17 19h4" />
      <path d="M9 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
    </svg>
  )
}
