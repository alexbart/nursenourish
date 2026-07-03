import { Button } from "@/components/Button";

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="font-heading font-semibold text-2xl text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-muted max-w-md mb-4">{description}</p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}