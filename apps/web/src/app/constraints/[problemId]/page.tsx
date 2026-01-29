"use client";

import { useState, KeyboardEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getProblem,
  getConstraints,
  createConstraints,
  lockConstraints,
} from "@/lib/api";
import { Lock, X, Plus, ArrowRight, CheckCircle } from "lucide-react";

const schema = z.object({
  attention_budget_seconds: z.string().min(1, "Required"),
  cadence: z.string().min(1, "Cadence is required"),
});

type FormData = z.infer<typeof schema>;

function TagInput({
  label,
  tags,
  onChange,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setValue("");
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Add ${label.toLowerCase()}...`}
        />
        <Button type="button" variant="secondary" size="sm" onClick={add}>
          <Plus size={14} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} color="indigo" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="hover:text-white"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function ConstraintsPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [workflowSystems, setWorkflowSystems] = useState<string[]>([]);
  const [nonNegotiables, setNonNegotiables] = useState<string[]>([]);
  const [complianceTags, setComplianceTags] = useState<string[]>([]);

  const { data: problem } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => getProblem(problemId),
  });

  const { data: existingConstraints } = useQuery({
    queryKey: ["constraints", problemId],
    queryFn: () => getConstraints(problemId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const cs = await createConstraints(problemId, {
        attention_budget_seconds: Number(data.attention_budget_seconds),
        cadence: data.cadence,
        workflow_systems: workflowSystems,
        non_negotiables: nonNegotiables,
        compliance_tags: complianceTags,
      });
      await lockConstraints(cs.id);
      return cs;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["constraints", problemId] });
    },
  });

  const isLocked = existingConstraints?.locked === true;

  return (
    <AppLayout
      activeStep="constraints"
      completedSteps={isLocked ? ["problems", "constraints"] : ["problems"]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href={`/problems/${problemId}`}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; {problem?.title ?? "Problem"}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">
            Lock Constraints
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Define constraints before ideation. No ideas can be created until
            constraints are locked.
          </p>
        </div>

        {isLocked ? (
          <Card className="border-emerald-800 bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-300">
                <CheckCircle size={20} /> Constraints Locked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-zinc-500">Attention Budget</p>
                  <p className="text-zinc-200">
                    {existingConstraints.attention_budget_seconds}s
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Cadence</p>
                  <p className="text-zinc-200">
                    {existingConstraints.cadence}
                  </p>
                </div>
              </div>
              {existingConstraints.workflow_systems.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-zinc-500">
                    Workflow Systems
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {existingConstraints.workflow_systems.map((s) => (
                      <Badge key={s} color="blue">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {existingConstraints.non_negotiables.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-zinc-500">Non-Negotiables</p>
                  <div className="flex flex-wrap gap-1">
                    {existingConstraints.non_negotiables.map((n) => (
                      <Badge key={n} color="red">
                        {n}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {existingConstraints.compliance_tags.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-zinc-500">Compliance</p>
                  <div className="flex flex-wrap gap-1">
                    {existingConstraints.compliance_tags.map((t) => (
                      <Badge key={t} color="yellow">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/ideas/new?problemId=${problemId}`}>
                <Button>
                  Create Ideas <ArrowRight size={16} />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4"
          >
            <Card>
              <CardContent className="space-y-4">
                <Input
                  label="Attention Budget (seconds)"
                  type="number"
                  placeholder="e.g. 30"
                  error={errors.attention_budget_seconds?.message}
                  {...register("attention_budget_seconds")}
                />
                <Input
                  label="Cadence"
                  placeholder="e.g. daily, weekly, on-demand"
                  error={errors.cadence?.message}
                  {...register("cadence")}
                />
                <TagInput
                  label="Workflow Systems"
                  tags={workflowSystems}
                  onChange={setWorkflowSystems}
                />
                <TagInput
                  label="Non-Negotiables"
                  tags={nonNegotiables}
                  onChange={setNonNegotiables}
                />
                <TagInput
                  label="Compliance Tags"
                  tags={complianceTags}
                  onChange={setComplianceTags}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createMutation.isPending}
            >
              <Lock size={16} />{" "}
              {createMutation.isPending
                ? "Locking..."
                : "Lock Constraints"}
            </Button>
            {createMutation.isError && (
              <p className="text-sm text-red-400">
                Failed to lock constraints.
              </p>
            )}
          </form>
        )}
      </div>
    </AppLayout>
  );
}
