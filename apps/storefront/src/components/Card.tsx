import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge("p-6 pb-0", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge("p-6 pt-0", className)} {...props} />;
}