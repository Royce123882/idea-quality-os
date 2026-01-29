"use client";

import React from "react";
import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500",
  secondary:
    "bg-zinc-700 text-zinc-100 hover:bg-zinc-600 focus-visible:ring-zinc-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
  ghost:
    "bg-transparent text-zinc-300 hover:bg-zinc-800 focus-visible:ring-zinc-500",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
