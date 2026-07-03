import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl",
        secondary: "bg-secondary text-white hover:bg-secondary/80",
        outline: "border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary hover:bg-primary/10",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}