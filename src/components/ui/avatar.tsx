"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Tooltip } from 'react-tooltip';

import { cn } from "../../lib/utils";

export interface customAvatarProps 
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  dataToolTip?: string;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  // React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  customAvatarProps
>(({ className, dataToolTip = '', ...props }, ref) => (
  <>
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    data-tooltip-id={dataToolTip}
    data-tooltip-content={dataToolTip}
    // data-tooltip-place="top"
    {...props}
  />
  <Tooltip 
    id={dataToolTip} 
    // opacity={0.3}
    style={{ 
      fontSize: "12px", 
      padding: "0px 8px", 
    }}
  />
  </>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-xl bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
