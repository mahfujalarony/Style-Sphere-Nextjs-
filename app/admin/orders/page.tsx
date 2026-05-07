import Link from "next/link";
import React from "react";

const orders = [
  {
    id: "ORD-3092",
    customer: "Nadia Chowdhury",
    date: "May 5, 2026",
    total: "$128.40",
    items: 3,
    status: "Shipped",
    channel: "Online",
  },
  {
    id: "ORD-3091",
    customer: "Samiul Islam",
    date: "May 4, 2026",
    total: "$74.10",
    items: 2,
    status: "Processing",
    channel: "Mobile",
  },
  {
    id: "ORD-3090",
    customer: "Tania Akter",
    date: "May 4, 2026",
    total: "$210.00",
    items: 5,
    status: "Delivered",
    channel: "Online",
  },
  {
    id: "ORD-3089",
    customer: "Rafi Hasan",
    date: "May 3, 2026",
    total: "$58.90",
    items: 1,
    status: "Cancelled",
    channel: "Store",
  },
  {
    id: "ORD-3088",
    customer: "Afsana Rahman",
    date: "May 3, 2026",
    total: "$146.70",
    items: 4,
    status: "Delivered",
    channel: "Online",
  },
];

const statusTone: Record<string, string> = {
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const page = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff1f2,#ffffff_45%,#e0f2fe_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Orders</p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">Orders</h1>
            <p className="mt-2 text-sm text-slate-600">Track fulfillment, payments, and customer status.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Back to Dashboard
            </Link>
            <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Orders Today</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">146</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">+9% vs yesterday</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending Fulfillment</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">38</p>
            <p className="mt-1 text-xs font-semibold text-amber-600">Needs review</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg. Order Value</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">$84.20</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">+4% 30d trend</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Latest Orders</h2>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">All</span>
              <span className="rounded-full bg-white px-3 py-1">Processing</span>
              <span className="rounded-full bg-white px-3 py-1">Shipped</span>
              <span className="rounded-full bg-white px-3 py-1">Delivered</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:grid-cols-[1.2fr_0.9fr_0.7fr_0.6fr_0.6fr_0.6fr]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                  <p className="text-xs text-slate-500">{order.customer}</p>
                </div>
                <div className="text-sm text-slate-600">{order.date}</div>
                <div className="text-sm font-semibold text-slate-900">{order.total}</div>
                <div className="text-sm text-slate-600">{order.items} items</div>
                <div className="text-xs font-semibold text-slate-600">{order.channel}</div>
                <div className="text-xs font-semibold">
                  <span
                    className={`rounded-full px-3 py-1 ${statusTone[order.status] || "bg-slate-100 text-slate-600"}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
