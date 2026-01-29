"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/stores/workspace";
import { getProblems, getIdeas, getGraveyard } from "@/lib/api";
import { AlertTriangle, Lightbulb, Skull, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const workspace = useWorkspaceStore((s) => s.current);

  const { data: problems } = useQuery({
    queryKey: ["problems", workspace?.id],
    queryFn: () => getProblems(workspace?.id),
    enabled: !!workspace,
  });

  const { data: ideas } = useQuery({
    queryKey: ["ideas", workspace?.id],
    queryFn: () => getIdeas({ workspace_id: workspace?.id }),
    enabled: !!workspace,
  });

  const { data: graveyard } = useQuery({
    queryKey: ["graveyard"],
    queryFn: () => getGraveyard(),
    enabled: !!workspace,
  });

  const killRate =
    ideas && ideas.length > 0
      ? Math.round(
          (ideas.filter((i) => i.status === "killed").length / ideas.length) *
            100
        )
      : 0;

  if (!workspace) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
            IQ
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">
            Idea Quality Operating System
          </h1>
          <p className="max-w-md text-center text-zinc-400">
            Systematically discover real problems, generate constraint-aware
            ideas, stress-test them, and kill weak ideas before execution.
          </p>
          <Link href="/workspaces">
            <Button size="lg">
              Get Started <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Workspace: {workspace.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-zinc-400">
                <AlertTriangle size={18} />
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Problems
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-100">
                {problems?.length ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-zinc-400">
                <Lightbulb size={18} />
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Ideas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-100">
                {ideas?.length ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-zinc-400">
                <Skull size={18} />
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Kill Rate
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-100">{killRate}%</p>
              <p className="text-xs text-zinc-500">
                {graveyard?.length ?? 0} ideas killed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Flow CTA */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Start the Evaluation Flow
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Problems &rarr; Constraints &rarr; Ideas &rarr; Evaluate &rarr;
                Decide
              </p>
            </div>
            <Link href="/problems">
              <Button>
                Begin <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
