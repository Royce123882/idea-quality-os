"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace";
import {
  LayoutDashboard,
  AlertTriangle,
  Lightbulb,
  Skull,
  ChevronDown,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: AlertTriangle },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/graveyard", label: "Graveyard", icon: Skull },
];

export function Sidebar() {
  const pathname = usePathname();
  const workspace = useWorkspaceStore((s) => s.current);

  return (
    <aside className="flex h-full w-60 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          IQ
        </div>
        <span className="text-base font-semibold text-zinc-100">IQOS</span>
      </div>

      {/* Workspace */}
      <Link
        href="/workspaces"
        className="mx-3 mb-4 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-700"
      >
        <span className="flex-1 truncate">
          {workspace?.name ?? "Select workspace"}
        </span>
        <ChevronDown size={14} />
      </Link>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-zinc-600">
        Idea Quality OS &middot; MVP
      </div>
    </aside>
  );
}
