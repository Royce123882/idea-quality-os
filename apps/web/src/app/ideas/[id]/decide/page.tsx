"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  getIdea,
  getIdeaScore,
  scoreIdea,
  decideIdea,
} from "@/lib/api";
import {
  CheckCircle,
  RotateCcw,
  Skull,
  BarChart3,
  Plus,
  X,
} from "lucide-react";

export default function DecidePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [decision, setDecision] = useState<"proceed" | "revise" | "kill" | null>(null);
  const [reasons, setReasons] = useState<string[]>([""]);
  const [killReasons, setKillReasons] = useState<string[]>([""]);
  const [learnings, setLearnings] = useState("");

  const { data: idea } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdea(id),
  });

  const { data: score, refetch: refetchScore } = useQuery({
    queryKey: ["score", id],
    queryFn: () => getIdeaScore(id),
  });

  const scoreMutation = useMutation({
    mutationFn: () => scoreIdea(id),
    onSuccess: () => refetchScore(),
  });

  const decideMutation = useMutation({
    mutationFn: () =>
      decideIdea(id, {
        decision: decision!,
        reasons: reasons.filter((r) => r.trim()),
        ...(decision === "kill" && {
          kill_reasons: killReasons.filter((r) => r.trim()),
          learnings: learnings.trim() || undefined,
        }),
      }),
    onSuccess: () => {
      if (decision === "kill") {
        router.push("/graveyard");
      } else {
        router.push(`/ideas/${id}`);
      }
    },
  });

  const addReason = () => setReasons([...reasons, ""]);
  const updateReason = (i: number, v: string) => {
    const updated = [...reasons];
    updated[i] = v;
    setReasons(updated);
  };
  const removeReason = (i: number) => setReasons(reasons.filter((_, idx) => idx !== i));

  const addKillReason = () => setKillReasons([...killReasons, ""]);
  const updateKillReason = (i: number, v: string) => {
    const updated = [...killReasons];
    updated[i] = v;
    setKillReasons(updated);
  };
  const removeKillReason = (i: number) =>
    setKillReasons(killReasons.filter((_, idx) => idx !== i));

  const canSubmit =
    decision && reasons.some((r) => r.trim()) &&
    (decision !== "kill" || killReasons.some((r) => r.trim()));

  return (
    <AppLayout
      activeStep="decide"
      completedSteps={["problems", "constraints", "ideas", "evaluate"]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href={`/ideas/${id}`}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; {idea?.title ?? "Idea"}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">Decision</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review the composite score and make an explicit decision.
          </p>
        </div>

        {/* Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-400" />
              Composite Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {score ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-zinc-100">
                    {score.composite.toFixed(1)}
                  </p>
                  <p className="text-sm text-zinc-500">out of 10</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Problem Severity", value: score.problem_severity },
                    { label: "Frequency", value: score.frequency },
                    { label: "Willingness to Pay", value: score.willingness_to_pay },
                    { label: "Constraint Fit", value: score.constraint_fit },
                    { label: "Attention Efficiency", value: score.attention_efficiency },
                    { label: "Replacement Clarity", value: score.replacement_clarity },
                  ].map((d) => (
                    <div key={d.label} className="rounded-lg bg-zinc-800 p-2 text-center">
                      <p className="text-xs text-zinc-500">{d.label}</p>
                      <p className="font-bold text-zinc-200">
                        {d.value.toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-3 text-sm text-zinc-400">
                  Score not yet computed.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => scoreMutation.mutate()}
                  disabled={scoreMutation.isPending}
                >
                  {scoreMutation.isPending ? "Scoring..." : "Compute Score"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decision buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setDecision("proceed")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
              decision === "proceed"
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <CheckCircle size={28} />
            <span className="text-sm font-medium">Proceed</span>
          </button>
          <button
            onClick={() => setDecision("revise")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
              decision === "revise"
                ? "border-yellow-500 bg-yellow-950/40 text-yellow-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <RotateCcw size={28} />
            <span className="text-sm font-medium">Revise</span>
          </button>
          <button
            onClick={() => setDecision("kill")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
              decision === "kill"
                ? "border-red-500 bg-red-950/40 text-red-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <Skull size={28} />
            <span className="text-sm font-medium">Kill</span>
          </button>
        </div>

        {/* Reasons */}
        {decision && (
          <Card>
            <CardHeader>
              <CardTitle>Reasons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reasons.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Reason ${i + 1}`}
                    value={r}
                    onChange={(e) => updateReason(i, e.target.value)}
                    className="flex-1"
                  />
                  {reasons.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReason(i)}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addReason}>
                <Plus size={14} /> Add Reason
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Kill-specific fields */}
        {decision === "kill" && (
          <Card className="border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-300">Kill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-400">
                Why is this idea being killed? These are archived for
                institutional learning.
              </p>
              {killReasons.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Kill reason ${i + 1}`}
                    value={r}
                    onChange={(e) => updateKillReason(i, e.target.value)}
                    className="flex-1"
                  />
                  {killReasons.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKillReason(i)}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addKillReason}>
                <Plus size={14} /> Add Kill Reason
              </Button>
              <Textarea
                label="Learnings (optional)"
                placeholder="What did we learn from this idea? What should we remember for next time?"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
              />
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        {decision && (
          <Button
            size="lg"
            className="w-full"
            variant={decision === "kill" ? "danger" : decision === "revise" ? "secondary" : "primary"}
            disabled={!canSubmit || decideMutation.isPending}
            onClick={() => decideMutation.mutate()}
          >
            {decideMutation.isPending
              ? "Submitting..."
              : decision === "kill"
              ? "Kill Idea"
              : decision === "revise"
              ? "Send Back for Revision"
              : "Proceed to Build"}
          </Button>
        )}
        {decideMutation.isError && (
          <p className="text-sm text-red-400">Decision submission failed.</p>
        )}
      </div>
    </AppLayout>
  );
}
