"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { key: "problems", label: "Problems" },
  { key: "constraints", label: "Constraints" },
  { key: "ideas", label: "Ideas" },
  { key: "evaluate", label: "Evaluate" },
  { key: "decide", label: "Decide" },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

interface ProgressStepsProps {
  active?: StepKey;
  completed?: StepKey[];
}

export function ProgressSteps({
  active,
  completed = [],
}: ProgressStepsProps) {
  return (
    <nav className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isActive = step.key === active;
        const isCompleted = completed.includes(step.key);
        return (
          <React.Fragment key={step.key}>
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-8",
                  isCompleted || isActive ? "bg-indigo-500" : "bg-zinc-700"
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-700 text-zinc-400"
                )}
              >
                {isCompleted ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isActive
                    ? "font-medium text-zinc-100"
                    : isCompleted
                    ? "text-zinc-300"
                    : "text-zinc-500"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
