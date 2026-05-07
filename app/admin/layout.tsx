"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          className={`fixed inset-0 z-30 bg-black/40 transition lg:hidden ${
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`fixed left-0 top-0 z-40 h-full w-72 transform overflow-y-auto overscroll-contain transition lg:static lg:h-full lg:translate-x-0 lg:border-r lg:border-slate-200 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
