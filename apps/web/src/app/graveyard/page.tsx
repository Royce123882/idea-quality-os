"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getGraveyard } from "@/lib/api";
import { Skull, Search, ArrowRight } from "lucide-react";

export default function GraveyardPage() {
  const [search, setSearch] = useState("");

  const { data: entries, isLoading } = useQuery({
    queryKey: ["graveyard", search],
    queryFn: () => getGraveyard({ search: search || undefined }),
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-100">
            <Skull size={24} /> Idea Graveyard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Killed ideas are archived, not deleted. Learn from what did not
            work.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search killed ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}

        {entries && entries.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Skull size={32} className="mx-auto mb-3 text-zinc-600" />
              <p className="text-zinc-400">
                {search
                  ? "No killed ideas match your search."
                  : "The graveyard is empty. No ideas have been killed yet."}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {entries?.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{entry.idea?.title ?? `Idea ${entry.idea_id}`}</span>
                  {entry.problem && (
                    <Link
                      href={`/problems/${entry.problem.id}`}
                      className="text-sm font-normal text-indigo-400 hover:underline"
                    >
                      {entry.problem.title} <ArrowRight size={12} className="inline" />
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Kill reasons */}
                <div>
                  <p className="mb-1 text-xs font-medium text-zinc-500">
                    Kill Reasons
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-300">
                    {entry.kill_reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} color="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Learnings */}
                {entry.learnings && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-zinc-500">
                      Learnings
                    </p>
                    <p className="rounded-lg bg-zinc-800 p-3 text-sm text-zinc-300">
                      {entry.learnings}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
