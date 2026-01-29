"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/stores/workspace";
import { getProblems } from "@/lib/api";
import { Upload, ArrowRight } from "lucide-react";

export default function ProblemsPage() {
  const workspace = useWorkspaceStore((s) => s.current);

  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problems", workspace?.id],
    queryFn: () => getProblems(workspace?.id),
    enabled: !!workspace,
  });

  return (
    <AppLayout activeStep="problems">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Problem Landscape
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Ranked list of discovered problems. Upload artifacts to generate
              more.
            </p>
          </div>
          <Link href="/problems/upload">
            <Button variant="secondary">
              <Upload size={16} /> Upload Artifacts
            </Button>
          </Link>
        </div>

        {!workspace && (
          <p className="text-sm text-zinc-500">
            Please{" "}
            <Link href="/workspaces" className="text-indigo-400 underline">
              select a workspace
            </Link>{" "}
            first.
          </p>
        )}

        {isLoading && <p className="text-sm text-zinc-500">Loading problems...</p>}
        {isError && (
          <p className="text-sm text-red-400">Failed to load problems.</p>
        )}

        <div className="space-y-3">
          {problems?.map((p) => (
            <Link key={p.id} href={`/problems/${p.id}`}>
              <Card className="transition-colors hover:border-zinc-600">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-1">
                    <p className="font-medium text-zinc-100">{p.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Badge color="blue">Freq: {p.frequency_score}</Badge>
                    <Badge color="yellow">Int: {p.intensity_score}</Badge>
                    <Badge color="red">WA: {p.workaround_cost_score}</Badge>
                    <ArrowRight size={16} className="text-zinc-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {problems && problems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-zinc-400">
                  No problems discovered yet.{" "}
                  <Link
                    href="/problems/upload"
                    className="text-indigo-400 underline"
                  >
                    Upload artifacts
                  </Link>{" "}
                  to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
