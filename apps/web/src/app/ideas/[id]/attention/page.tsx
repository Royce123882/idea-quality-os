"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIdea, getAttentionEconomics, calculateAttentionEconomics } from "@/lib/api";
import { Brain, ArrowRight } from "lucide-react";

const schema = z.object({
  time_per_interaction_sec: z.string().min(1),
  frequency_per_week: z.string().min(1),
  cognitive_load_score: z.string().min(1),
  emotional_friction_score: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function AttentionEconomicsPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: idea } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdea(id),
  });

  const { data: existing } = useQuery({
    queryKey: ["attention", id],
    queryFn: () => getAttentionEconomics(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      calculateAttentionEconomics(id, {
        time_per_interaction_sec: Number(data.time_per_interaction_sec),
        frequency_per_week: Number(data.frequency_per_week),
        cognitive_load_score: Number(data.cognitive_load_score),
        emotional_friction_score: Number(data.emotional_friction_score),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attention", id] });
    },
  });

  return (
    <AppLayout
      activeStep="evaluate"
      completedSteps={["problems", "constraints", "ideas"]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href={`/ideas/${id}`}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; {idea?.title ?? "Idea"}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">
            Attention Economics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Quantify whether this idea is worth the user&apos;s attention.
          </p>
        </div>

        {existing && (
          <Card className="border-indigo-800 bg-indigo-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} className="text-indigo-400" />
                Attention Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-lg bg-zinc-800 p-3 text-center">
                  <p className="text-xs text-zinc-500">Time/Interaction</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {existing.time_per_interaction_sec}s
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800 p-3 text-center">
                  <p className="text-xs text-zinc-500">Freq/Week</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {existing.frequency_per_week}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800 p-3 text-center">
                  <p className="text-xs text-zinc-500">Cognitive Load</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {existing.cognitive_load_score}/10
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800 p-3 text-center">
                  <p className="text-xs text-zinc-500">Emotional Friction</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {existing.emotional_friction_score}/10
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-900/50 p-3 text-center">
                  <p className="text-xs text-indigo-300">Ratio Score</p>
                  <p className="text-2xl font-bold text-indigo-300">
                    {existing.ratio_score.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/ideas/${id}/decide`}>
                  <Button>
                    Proceed to Decision <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Calculate Attention Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <Input
                label="Time per Interaction (seconds)"
                type="number"
                placeholder="e.g. 30"
                error={errors.time_per_interaction_sec?.message}
                {...register("time_per_interaction_sec")}
              />
              <Input
                label="Frequency per Week"
                type="number"
                step="0.1"
                placeholder="e.g. 5"
                error={errors.frequency_per_week?.message}
                {...register("frequency_per_week")}
              />
              <Input
                label="Cognitive Load Score (1-10)"
                type="number"
                min={1}
                max={10}
                placeholder="1 = trivial, 10 = exhausting"
                error={errors.cognitive_load_score?.message}
                {...register("cognitive_load_score")}
              />
              <Input
                label="Emotional Friction Score (1-10)"
                type="number"
                min={1}
                max={10}
                placeholder="1 = pleasant, 10 = dreaded"
                error={errors.emotional_friction_score?.message}
                {...register("emotional_friction_score")}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Calculating..." : "Calculate"}
              </Button>
              {mutation.isError && (
                <p className="text-sm text-red-400">Calculation failed.</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
