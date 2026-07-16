import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="font-heading font-semibold text-xl text-text mb-2">{title}</h3>
      {description && <p className="text-muted text-sm max-w-sm">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
