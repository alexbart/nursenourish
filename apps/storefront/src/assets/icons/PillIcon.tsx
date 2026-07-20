import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function PillIcon({ className, name = 'pill', ...props }: IconProps) {
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
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 13.5 5-5" />
    </svg>
  )
}
