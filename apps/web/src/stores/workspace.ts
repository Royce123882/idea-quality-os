import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workspace } from "@/lib/api";

interface WorkspaceState {
  current: Workspace | null;
  setCurrent: (ws: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      current: null,
      setCurrent: (ws) => set({ current: ws }),
    }),
    { name: "iqos-workspace" }
  )
);
