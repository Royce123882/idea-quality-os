"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/stores/workspace";
import { uploadArtifact, recomputeProblems } from "@/lib/api";
import { Upload, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UploadArtifactsPage() {
  const workspace = useWorkspaceStore((s) => s.current);
  const [textInput, setTextInput] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!workspace) throw new Error("No workspace selected");
      const artifacts: string[] = [];

      if (textInput.trim()) {
        artifacts.push(textInput.trim());
      }

      if (csvContent.trim()) {
        const lines = csvContent.trim().split("\n");
        for (const line of lines) {
          if (line.trim()) artifacts.push(line.trim());
        }
      }

      for (const text of artifacts) {
        await uploadArtifact({
          workspace_id: workspace.id,
          type: "text",
          text_excerpt: text,
        });
      }

      await recomputeProblems();
    },
    onSuccess: () => {
      setUploaded(true);
      setTextInput("");
      setCsvContent("");
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  if (!workspace) {
    return (
      <AppLayout activeStep="problems">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-zinc-500">
            Please{" "}
            <Link href="/workspaces" className="text-indigo-400 underline">
              select a workspace
            </Link>{" "}
            first.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeStep="problems">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href="/problems"
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            &larr; Problems
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-100">
            Upload Artifacts
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Paste text from support tickets, sales calls, user interviews, or
            upload a CSV file.
          </p>
        </div>

        {uploaded && (
          <Card className="border-emerald-800 bg-emerald-950/30">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle size={20} className="text-emerald-400" />
              <div>
                <p className="font-medium text-emerald-300">
                  Artifacts uploaded successfully
                </p>
                <p className="text-sm text-emerald-400/70">
                  Problems are being generated from your artifacts. Check the{" "}
                  <Link
                    href="/problems"
                    className="underline hover:text-emerald-300"
                  >
                    problem landscape
                  </Link>{" "}
                  shortly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paste text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} /> Paste Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste support ticket text, interview transcript, customer feedback, etc. Each artifact can be separated by a blank line."
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* CSV upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={18} /> Upload CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-600"
            />
            {csvContent && (
              <div className="rounded-lg bg-zinc-800 p-3">
                <p className="mb-1 text-xs text-zinc-500">Preview:</p>
                <pre className="max-h-40 overflow-y-auto text-xs text-zinc-300">
                  {csvContent.slice(0, 1000)}
                  {csvContent.length > 1000 ? "..." : ""}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          disabled={
            uploadMutation.isPending ||
            (!textInput.trim() && !csvContent.trim())
          }
          onClick={() => uploadMutation.mutate()}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload & Generate Problems"}
        </Button>

        {uploadMutation.isError && (
          <p className="text-sm text-red-400">
            Upload failed. Please try again.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
