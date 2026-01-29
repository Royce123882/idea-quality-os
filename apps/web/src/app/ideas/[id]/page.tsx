"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getIdea,
  getProblem,
  getEvaluations,
  getAttentionEconomics,
  getIdeaScore,
} from "@/lib/api";
import {
  FlaskConical,
  Brain,
  BarChart3,
  Gavel,
  ArrowRight,
} from "lucide-react";

const statusColor: Record<string, "default" | "green" | "red" | "yellow" | "blue"> = {
  draft: "default",
  active: "blue",
  killed: "red",
  proceeded: "green",
};

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: idea, isLoading } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdea(id),
  });

  const { data: problem } = useQuery({
    queryKey: ["problem", idea?.problem_id],
    queryFn: () => getProblem(idea!.problem_id),
    enabled: !!idea,
  });

  const { data: evaluations } = useQuery({
    queryKey: ["evaluations", id],
    queryFn: () => getEvaluations(id),
  });

  const { data: attention } = useQuery({
    queryKey: ["attention", id],
    queryFn: () => getAttentionEconomics(id),
  });

  const { data: score } = useQuery({
    queryKey: ["score", id],
    queryFn: () => getIdeaScore(id),
  });

  if (isLoading) {
    return (
      <AppLayout activeStep="evaluate">
        <p className="text-sm text-zinc-500">Loading...</p>
      </AppLayout>
    );
  }

  if (!idea) {
    return (
      <AppLayout activeStep="evaluate">
        <p className="text-sm text-red-400">Idea not found.</p>
      </AppLayout>
    );
  }

  const completedLenses = new Set(evaluations?.map((e) => e.lens) ?? []);

  return (
    <AppLayout
      activeStep="evaluate"
      completedSteps={["problems", "constraints", "ideas"]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/ideas"
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              &larr; Ideas
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-zinc-100">
              {idea.title}
            </h1>
            {problem && (
              <p className="mt-1 text-sm text-zinc-400">
                Problem: {problem.title}
              </p>
            )}
          </div>
          <Badge color={statusColor[idea.status] ?? "default"}>
            {idea.status}
          </Badge>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-500">Pitch</p>
              <p className="mt-1 text-sm text-zinc-200">{idea.pitch}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Replacement Statement
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {idea.replacement_statement}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500">Wedge</p>
              <p className="mt-1 text-sm text-zinc-200">{idea.wedge}</p>
            </div>
            {idea.assumptions.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  Assumptions
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-300">
                  {idea.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href={`/ideas/${id}/stress-test`}>
            <Card className="h-full cursor-pointer transition-colors hover:border-zinc-600">
              <CardContent className="flex items-center gap-4 py-5">
                <FlaskConical size={24} className="text-indigo-400" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-100">Stress Test</p>
                  <p className="text-xs text-zinc-400">
                    {completedLenses.size}/5 lenses completed
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-500" />
              </CardContent>
            </Card>
          </Link>

          <Link href={`/ideas/${id}/attention`}>
            <Card className="h-full cursor-pointer transition-colors hover:border-zinc-600">
              <CardContent className="flex items-center gap-4 py-5">
                <Brain size={24} className="text-yellow-400" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-100">
                    Attention Economics
                  </p>
                  <p className="text-xs text-zinc-400">
                    {attention
                      ? `Ratio: ${attention.ratio_score.toFixed(2)}`
                      : "Not calculated"}
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-500" />
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <BarChart3 size={24} className="text-emerald-400" />
              <div className="flex-1">
                <p className="font-medium text-zinc-100">Composite Score</p>
                <p className="text-xs text-zinc-400">
                  {score
                    ? `${score.composite.toFixed(1)} / 10`
                    : "Not scored yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Link href={`/ideas/${id}/decide`}>
            <Card className="h-full cursor-pointer transition-colors hover:border-zinc-600">
              <CardContent className="flex items-center gap-4 py-5">
                <Gavel size={24} className="text-red-400" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-100">Decision</p>
                  <p className="text-xs text-zinc-400">
                    Proceed, Revise, or Kill
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-500" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Score breakdown */}
        {score && (
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Problem Severity", value: score.problem_severity },
                  { label: "Frequency", value: score.frequency },
                  {
                    label: "Willingness to Pay",
                    value: score.willingness_to_pay,
                  },
                  { label: "Constraint Fit", value: score.constraint_fit },
                  {
                    label: "Attention Efficiency",
                    value: score.attention_efficiency,
                  },
                  {
                    label: "Replacement Clarity",
                    value: score.replacement_clarity,
                  },
                ].map((dim) => (
                  <div key={dim.label} className="rounded-lg bg-zinc-800 p-3">
                    <p className="text-xs text-zinc-500">{dim.label}</p>
                    <p className="text-lg font-bold text-zinc-100">
                      {dim.value.toFixed(1)}
                    </p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-700">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500"
                        style={{ width: `${dim.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
