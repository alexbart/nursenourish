import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string
}

export function TemplateIcon({ className, name = 'icon', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={name}
      role="img"
      {...props}
    >
      {/* Paste Flaticon SVG path(s) here */}
      <path d="REPLACE_WITH_FLATICON_PATH" />
    </svg>
  )
}
