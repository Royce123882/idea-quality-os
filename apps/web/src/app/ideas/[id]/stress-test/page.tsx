"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getIdea, getEvaluations, runStressTest, type Evaluation } from "@/lib/api";
import { CheckCircle, Circle } from "lucide-react";

const LENSES = [
  {
    key: "user",
    label: "User Lens",
    question: "Why would I care?",
    prompts: [
      "What specific pain does this relieve for the user?",
      "How does the user discover this exists?",
      "What is the user doing the moment before they need this?",
    ],
  },
  {
    key: "buyer",
    label: "Buyer Lens",
    question: "Why would I pay?",
    prompts: [
      "Who writes the check and what do they measure?",
      "What budget line does this replace or create?",
      "What happens to the buyer if they do nothing?",
    ],
  },
  {
    key: "attention",
    label: "Attention Lens",
    question: "What do I drop for this?",
    prompts: [
      "What current tool or habit does this displace?",
      "How many seconds does this demand per interaction?",
      "What is the cognitive cost of switching to this?",
    ],
  },
  {
    key: "workflow",
    label: "Workflow Lens",
    question: "Where does this live?",
    prompts: [
      "Which existing system does this plug into?",
      "What breaks if the integration fails?",
      "Who is responsible for maintaining this in the org?",
    ],
  },
  {
    key: "timing",
    label: "Timing Lens",
    question: "Why now?",
    prompts: [
      "What has changed that makes this possible or necessary now?",
      "What tried before and failed? Why is now different?",
      "What tailwind or forcing function accelerates adoption?",
    ],
  },
];

export default function StressTestPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [activeLens, setActiveLens] = useState(LENSES[0].key);
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  const { data: idea } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdea(id),
  });

  const { data: evaluations } = useQuery({
    queryKey: ["evaluations", id],
    queryFn: () => getEvaluations(id),
  });

  const completedLenses = new Map<string, Evaluation>();
  evaluations?.forEach((e) => completedLenses.set(e.lens, e));

  const mutation = useMutation({
    mutationFn: (lens: string) =>
      runStressTest(id, {
        lens,
        responses: responses[lens] ?? [],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["evaluations", id] });
    },
  });

  const currentLens = LENSES.find((l) => l.key === activeLens)!;
  const currentResponses = responses[activeLens] ?? currentLens.prompts.map(() => "");
  const existingEval = completedLenses.get(activeLens);

  const setResponse = (index: number, value: string) => {
    const updated = [...currentResponses];
    updated[index] = value;
    setResponses({ ...responses, [activeLens]: updated });
  };

  return (
    <AppLayout
      activeStep="evaluate"
      completedSteps={["problems", "constraints", "ideas"]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href={`/ideas/${id}`}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; {idea?.title ?? "Idea"}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">
            Stress Test
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Evaluate through 5 adversarial lenses. No vague answers allowed.
          </p>
        </div>

        {/* Lens selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {LENSES.map((lens) => {
            const done = completedLenses.has(lens.key);
            const isActive = activeLens === lens.key;
            return (
              <button
                key={lens.key}
                onClick={() => setActiveLens(lens.key)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-indigo-500 bg-indigo-950/40 text-indigo-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {done ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <Circle size={14} />
                )}
                {lens.label}
              </button>
            );
          })}
        </div>

        {/* Current lens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentLens.label}</span>
              <span className="text-sm font-normal text-zinc-400">
                &ldquo;{currentLens.question}&rdquo;
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingEval ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-emerald-950/30 p-3">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-300">
                    Completed &middot; Score: {existingEval.score}/10 &middot;
                    Confidence: {Math.round(existingEval.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-zinc-500">
                    Rationale
                  </p>
                  <p className="text-sm text-zinc-300">
                    {existingEval.rationale}
                  </p>
                </div>
                {existingEval.responses.map((r, i) => (
                  <div key={i}>
                    <p className="mb-1 text-xs font-medium text-zinc-500">
                      {currentLens.prompts[i]}
                    </p>
                    <p className="text-sm text-zinc-300">{r}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {currentLens.prompts.map((prompt, i) => (
                  <Textarea
                    key={i}
                    label={prompt}
                    placeholder="Be specific. Vague answers weaken your score."
                    value={currentResponses[i] ?? ""}
                    onChange={(e) => setResponse(i, e.target.value)}
                    rows={3}
                  />
                ))}
              </>
            )}
          </CardContent>
          {!existingEval && (
            <CardFooter>
              <Button
                onClick={() => mutation.mutate(activeLens)}
                disabled={
                  mutation.isPending ||
                  currentResponses.some((r) => !r.trim())
                }
              >
                {mutation.isPending ? "Submitting..." : "Submit Lens"}
              </Button>
              {mutation.isError && (
                <p className="ml-3 text-sm text-red-400">Submission failed.</p>
              )}
            </CardFooter>
          )}
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-zinc-400">
              Completed: {completedLenses.size} / {LENSES.length} lenses
              {completedLenses.size === LENSES.length && (
                <span className="ml-2 text-emerald-400">
                  All done! Proceed to{" "}
                  <Link
                    href={`/ideas/${id}/attention`}
                    className="underline"
                  >
                    Attention Economics
                  </Link>{" "}
                  or{" "}
                  <Link href={`/ideas/${id}/decide`} className="underline">
                    Decision
                  </Link>
                  .
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
