"use client";

import Link from "next/link";
import React from "react";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
  PhoneOutgoing
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package},
  { label: "Categories", href: "/admin/categories", icon: Package },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reels", href: "/admin/reels", icon: PhoneOutgoing },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
};

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  return (
    <aside className="h-full w-full overflow-y-auto overscroll-contain border-b border-slate-200 bg-white/90 backdrop-blur lg:h-full lg:w-72 lg:border-b-0">
      <div className="flex min-h-full flex-col px-5 py-6 lg:px-6 lg:py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Style Sphere</p>
            <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">
            Live
          </span>
        </div>

        <div className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Quick Action</p>
          <p className="mt-2 text-sm font-semibold">Add a new product drop</p>
          <button className="mt-4 w-full rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20">
            Create Product
          </button>
        </div>

        <div className="mt-auto pt-8 text-xs text-slate-500">
          <p>Updated 2 minutes ago</p>
          <p className="mt-1">Support: admin@stylesphere.com</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
