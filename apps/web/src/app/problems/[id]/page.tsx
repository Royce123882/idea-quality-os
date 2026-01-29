"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProblem, getConstraints } from "@/lib/api";
import { Lock, ArrowRight, AlertTriangle } from "lucide-react";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: problem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblem(id),
  });

  const { data: constraints } = useQuery({
    queryKey: ["constraints", id],
    queryFn: () => getConstraints(id),
  });

  if (isLoading) {
    return (
      <AppLayout activeStep="problems">
        <p className="text-sm text-zinc-500">Loading...</p>
      </AppLayout>
    );
  }

  if (isError || !problem) {
    return (
      <AppLayout activeStep="problems">
        <p className="text-sm text-red-400">Failed to load problem.</p>
      </AppLayout>
    );
  }

  const isLocked = constraints?.locked === true;

  return (
    <AppLayout activeStep="problems" completedSteps={isLocked ? ["problems"] : []}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/problems"
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              &larr; Problems
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-zinc-100">
              {problem.title}
            </h1>
          </div>
          <Badge color={problem.status === "active" ? "green" : "default"}>
            {problem.status}
          </Badge>
        </div>

        {/* Brief */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-300">{problem.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-zinc-800 p-3 text-center">
                <p className="text-xs text-zinc-500">Frequency</p>
                <p className="text-xl font-bold text-blue-400">
                  {problem.frequency_score}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3 text-center">
                <p className="text-xs text-zinc-500">Intensity</p>
                <p className="text-xl font-bold text-yellow-400">
                  {problem.intensity_score}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3 text-center">
                <p className="text-xs text-zinc-500">Workaround Cost</p>
                <p className="text-xl font-bold text-red-400">
                  {problem.workaround_cost_score}
                </p>
              </div>
            </div>

            {problem.roles_impacted.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500">
                  Roles Impacted
                </p>
                <div className="flex flex-wrap gap-2">
                  {problem.roles_impacted.map((role) => (
                    <Badge key={role} color="indigo">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-500">Confidence</p>
              <div className="mt-1 h-2 w-full rounded-full bg-zinc-700">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${problem.confidence * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {Math.round(problem.confidence * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Constraint status */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLocked ? (
                <>
                  <Lock size={20} className="text-emerald-400" />
                  <div>
                    <p className="font-medium text-zinc-100">
                      Constraints Locked
                    </p>
                    <p className="text-xs text-zinc-400">
                      Version {constraints?.version} &middot; Ready for ideation
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={20} className="text-yellow-400" />
                  <div>
                    <p className="font-medium text-zinc-100">
                      Constraints Not Locked
                    </p>
                    <p className="text-xs text-zinc-400">
                      Lock constraints before creating ideas
                    </p>
                  </div>
                </>
              )}
            </div>
            {isLocked ? (
              <Link href={`/ideas/new?problemId=${id}`}>
                <Button>
                  Create Ideas <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => router.push(`/constraints/${id}`)}
              >
                Lock Constraints <Lock size={16} />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
