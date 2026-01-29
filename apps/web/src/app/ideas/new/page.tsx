"use client";

import { useState, KeyboardEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/stores/workspace";
import { getProblems, getConstraints, createIdea } from "@/lib/api";
import { Plus, X, AlertTriangle } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  pitch: z.string().min(10, "Pitch must be at least 10 characters"),
  replacement_statement: z.string().min(1, "Replacement statement is required"),
  wedge: z.string().min(1, "Wedge is required"),
});

type FormData = z.infer<typeof schema>;

export default function NewIdeaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspace = useWorkspaceStore((s) => s.current);

  const [selectedProblemId, setSelectedProblemId] = useState(
    searchParams.get("problemId") ?? ""
  );
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [assumptionInput, setAssumptionInput] = useState("");

  const { data: problems } = useQuery({
    queryKey: ["problems", workspace?.id],
    queryFn: () => getProblems(workspace?.id),
    enabled: !!workspace,
  });

  const { data: constraints, isError: constraintsError } = useQuery({
    queryKey: ["constraints", selectedProblemId],
    queryFn: () => getConstraints(selectedProblemId),
    enabled: !!selectedProblemId,
  });

  const isLocked = constraints?.locked === true;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createIdea({
        workspace_id: workspace!.id,
        problem_id: selectedProblemId,
        constraint_set_id: constraints!.id,
        title: data.title,
        pitch: data.pitch,
        replacement_statement: data.replacement_statement,
        wedge: data.wedge,
        assumptions,
      }),
    onSuccess: (idea) => {
      router.push(`/ideas/${idea.id}`);
    },
  });

  const addAssumption = () => {
    const trimmed = assumptionInput.trim();
    if (trimmed && !assumptions.includes(trimmed)) {
      setAssumptions([...assumptions, trimmed]);
    }
    setAssumptionInput("");
  };

  const handleAssumptionKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAssumption();
    }
  };

  const problemOptions = (problems ?? []).map((p) => ({
    value: p.id,
    label: p.title,
  }));

  return (
    <AppLayout
      activeStep="ideas"
      completedSteps={["problems", "constraints"]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href="/ideas"
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; Ideas
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">
            Create New Idea
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ideas must be linked to a problem with locked constraints.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          {/* Problem select */}
          <Card>
            <CardContent>
              <Select
                label="Problem"
                options={problemOptions}
                placeholder="Select a problem..."
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
              />
              {selectedProblemId && !isLocked && !constraintsError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-950/30 p-3 text-sm text-yellow-300">
                  <AlertTriangle size={16} />
                  Constraints are not locked for this problem.{" "}
                  <Link
                    href={`/constraints/${selectedProblemId}`}
                    className="underline"
                  >
                    Lock them first.
                  </Link>
                </div>
              )}
              {selectedProblemId && isLocked && (
                <p className="mt-2 text-xs text-emerald-400">
                  Constraints locked (v{constraints?.version})
                </p>
              )}
            </CardContent>
          </Card>

          {/* Idea form */}
          <Card>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                placeholder="Short, descriptive name"
                error={errors.title?.message}
                {...register("title")}
              />
              <Textarea
                label="Pitch"
                placeholder="What is this idea and why does it matter?"
                error={errors.pitch?.message}
                {...register("pitch")}
              />
              <Textarea
                label="Replacement Statement"
                placeholder="What does this replace? What disappears when this exists?"
                error={errors.replacement_statement?.message}
                {...register("replacement_statement")}
              />
              <Input
                label="Wedge"
                placeholder="What is the narrow entry point?"
                error={errors.wedge?.message}
                {...register("wedge")}
              />

              {/* Assumptions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">
                  Assumptions
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={assumptionInput}
                    onChange={(e) => setAssumptionInput(e.target.value)}
                    onKeyDown={handleAssumptionKey}
                    placeholder="Add an assumption..."
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addAssumption}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {assumptions.map((a) => (
                    <Badge key={a} color="yellow" className="gap-1">
                      {a}
                      <button
                        type="button"
                        onClick={() =>
                          setAssumptions(assumptions.filter((x) => x !== a))
                        }
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mutation.isPending || !isLocked}
          >
            {mutation.isPending ? "Creating..." : "Create Idea"}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-red-400">Failed to create idea.</p>
          )}
        </form>
      </div>
    </AppLayout>
  );
}
