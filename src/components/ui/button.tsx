"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip } from 'react-tooltip';

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  dataToolTip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, dataToolTip, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const dataTip = dataToolTip ? dataToolTip : "";
    return (
      <>
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-tooltip-id={dataTip}
        data-tooltip-content={dataTip}
        // data-tooltip-place="top"
        {...props}
      />
      <Tooltip 
        id={dataTip} 
        // opacity={0.3}
        style={{ 
          fontSize: "12px", 
          padding: "0px 8px", 
        }}
      />
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
