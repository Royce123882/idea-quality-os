"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/stores/workspace";
import { getWorkspaces, createWorkspace, type Workspace } from "@/lib/api";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({ name: z.string().min(1, "Name is required") });
type FormData = z.infer<typeof schema>;

export default function WorkspacesPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { current, setCurrent } = useWorkspaceStore();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (ws) => {
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      setCurrent(ws);
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectWorkspace = (ws: Workspace) => {
    setCurrent(ws);
    router.push("/");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold text-zinc-100">Workspaces</h1>

        {/* Create */}
        <Card>
          <CardContent>
            <form
              onSubmit={handleSubmit((d) => mutation.mutate(d))}
              className="flex gap-3"
            >
              <div className="flex-1">
                <Input
                  placeholder="New workspace name"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>
              <Button type="submit" disabled={mutation.isPending}>
                <Plus size={16} /> Create
              </Button>
            </form>
            {mutation.isError && (
              <p className="mt-2 text-sm text-red-400">
                Failed to create workspace.
              </p>
            )}
          </CardContent>
        </Card>

        {/* List */}
        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}
        <div className="space-y-2">
          {workspaces?.map((ws) => (
            <Card
              key={ws.id}
              className="cursor-pointer transition-colors hover:border-zinc-600"
              onClick={() => selectWorkspace(ws)}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-zinc-100">{ws.name}</p>
                  <p className="text-xs text-zinc-500">
                    Created {new Date(ws.created_at).toLocaleDateString()}
                  </p>
                </div>
                {current?.id === ws.id && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check size={16} />
                    <span className="text-xs">Active</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {workspaces && workspaces.length === 0 && (
            <p className="text-sm text-zinc-500">
              No workspaces yet. Create one above.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
