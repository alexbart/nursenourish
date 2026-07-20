import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function HospitalIcon({ className, name = 'hospital', ...props }: IconProps) {
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
      <path d="M8 21h8a2 2 0 0 0 2-2v-2H6v2a2 2 0 0 0 2 2" />
      <path d="M6 17V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
      <path d="M12 7v5" />
      <path d="M10 9h4" />
    </svg>
  )
}
