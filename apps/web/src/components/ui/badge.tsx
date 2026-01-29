import React from "react";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  default: "bg-zinc-700 text-zinc-300",
  indigo: "bg-indigo-900/60 text-indigo-300",
  green: "bg-emerald-900/60 text-emerald-300",
  yellow: "bg-yellow-900/60 text-yellow-300",
  red: "bg-red-900/60 text-red-300",
  blue: "bg-blue-900/60 text-blue-300",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: keyof typeof colorMap;
}

export function Badge({ className, color = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[color],
        className
      )}
      {...props}
    />
  );
}
