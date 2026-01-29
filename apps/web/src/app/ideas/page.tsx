"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/stores/workspace";
import { getIdeas, getProblems } from "@/lib/api";
import { Plus, ArrowRight } from "lucide-react";

const statusColor: Record<string, "default" | "green" | "red" | "yellow" | "blue" | "indigo"> = {
  draft: "default",
  active: "blue",
  killed: "red",
  proceeded: "green",
};

export default function IdeasPage() {
  const workspace = useWorkspaceStore((s) => s.current);

  const { data: ideas, isLoading } = useQuery({
    queryKey: ["ideas", workspace?.id],
    queryFn: () => getIdeas({ workspace_id: workspace?.id }),
    enabled: !!workspace,
  });

  const { data: problems } = useQuery({
    queryKey: ["problems", workspace?.id],
    queryFn: () => getProblems(workspace?.id),
    enabled: !!workspace,
  });

  const problemMap = new Map(problems?.map((p) => [p.id, p]));

  // Group ideas by problem
  const grouped = new Map<string, typeof ideas>();
  ideas?.forEach((idea) => {
    const key = idea.problem_id;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(idea);
  });

  return (
    <AppLayout activeStep="ideas" completedSteps={["problems", "constraints"]}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Ideas</h1>
            <p className="mt-1 text-sm text-zinc-400">
              All ideas grouped by problem, with status tracking.
            </p>
          </div>
          <Link href="/ideas/new">
            <Button>
              <Plus size={16} /> New Idea
            </Button>
          </Link>
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}

        {ideas && ideas.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-400">
                No ideas yet. Create one after locking constraints on a problem.
              </p>
            </CardContent>
          </Card>
        )}

        {[...grouped.entries()].map(([problemId, groupIdeas]) => {
          const problem = problemMap.get(problemId);
          return (
            <div key={problemId} className="space-y-2">
              <h2 className="text-sm font-semibold text-zinc-400">
                {problem?.title ?? `Problem ${problemId}`}
              </h2>
              {groupIdeas?.map((idea) => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <Card className="transition-colors hover:border-zinc-600">
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex-1">
                        <p className="font-medium text-zinc-100">
                          {idea.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
                          {idea.pitch}
                        </p>
                      </div>
                      <Badge color={statusColor[idea.status] ?? "default"}>
                        {idea.status}
                      </Badge>
                      <ArrowRight size={16} className="text-zinc-500" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
