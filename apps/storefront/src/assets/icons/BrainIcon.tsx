import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function BrainIcon({ className, name = 'brain', ...props }: IconProps) {
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
      <path d="M9.5 18A2.5 2.5 0 0 1 7 15.5V11a2.5 2.5 0 0 1 5 0v4.5a2.5 2.5 0 0 1-2.5 2.5" />
      <path d="M14.5 18A2.5 2.5 0 0 1 12 15.5V11a2.5 2.5 0 0 1 5 0v4.5a2.5 2.5 0 0 1-2.5 2.5" />
      <path d="M17.5 11a2.5 2.5 0 0 1 5 0v4.5a2.5 2.5 0 0 1-5 0" />
      <path d="M6.5 11a2.5 2.5 0 0 0-5 0v4.5a2.5 2.5 0 0 0 5 0" />
      <path d="M12 2v4" />
      <path d="M12 8a3.5 3.5 0 0 0-3.5-3.5" />
      <path d="M12 8a3.5 3.5 0 0 1 3.5-3.5" />
      <path d="M12 8V2" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  )
}
