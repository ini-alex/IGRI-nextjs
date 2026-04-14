import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ios-md text-sm font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ios-accent text-white hover:bg-ios-accent/90",
        destructive: "bg-ios-red text-white hover:bg-ios-red/90",
        outline: "border border-ios-separator bg-transparent hover:bg-ios-surface-secondary text-ios-text-primary",
        secondary: "bg-ios-surface-secondary text-ios-text-primary hover:bg-ios-surface-secondary/80",
        ghost: "hover:bg-ios-surface-secondary text-ios-text-primary",
        link: "text-ios-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-ios-md px-3",
        lg: "h-14 rounded-ios-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
