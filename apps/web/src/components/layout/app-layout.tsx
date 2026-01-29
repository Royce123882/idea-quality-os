"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { ProgressSteps, type StepKey } from "@/components/ui/progress-steps";

interface AppLayoutProps {
  children: React.ReactNode;
  activeStep?: StepKey;
  completedSteps?: StepKey[];
}

export function AppLayout({
  children,
  activeStep,
  completedSteps,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Progress header */}
        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
          <ProgressSteps active={activeStep} completed={completedSteps} />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
