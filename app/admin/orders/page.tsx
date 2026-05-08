import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import AdminOrderStatusControl from "@/components/admin/AdminOrderStatusControl";
import dbConnect from "@/lib/mongodb";
import OrderModel from "@/models/Order";

const formatDate = (value: Date) =>
  value.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const page = async () => {
  await connection();
  await dbConnect();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, pendingCount, avgOrderValue, latestOrders] = await Promise.all([
    OrderModel.countDocuments({ createdAt: { $gte: startOfDay } }),
    OrderModel.countDocuments({ status: "pending" }),
    OrderModel.aggregate([
      { $group: { _id: null, avg: { $avg: "$total" } } },
    ]),
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("productRef productTitle productImage selectedColor selectedSize customerName phone address note total quantity status createdAt")
      .lean(),
  ]);

  const avgValue = avgOrderValue[0]?.avg ?? 0;
  const orders = latestOrders.map((order) => ({
    id: String(order._id),
    productId: String(order.productRef),
    productTitle: order.productTitle,
    productImage: order.productImage,
    color: order.selectedColor || "Not selected",
    size: order.selectedSize || "Not selected",
    customer: order.customerName,
    phone: order.phone,
    address: order.address,
    note: order.note,
    date: formatDate(order.createdAt),
    total: `Tk ${order.total.toLocaleString()}`,
    quantity: order.quantity,
    status: order.status ?? "pending",
  }));

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
            <p className="mt-3 text-2xl font-semibold text-slate-900">{ordersToday}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Live count</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending Fulfillment</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{pendingCount}</p>
            <p className="mt-1 text-xs font-semibold text-amber-600">Needs review</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg. Order Value</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">Tk {avgValue.toLocaleString()}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Latest average</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Latest Orders</h2>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">All</span>
              <span className="rounded-full bg-white px-3 py-1">Pending</span>
              <span className="rounded-full bg-white px-3 py-1">Shipped</span>
              <span className="rounded-full bg-white px-3 py-1">Delivered</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                No orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:grid-cols-[1.7fr_1.1fr_0.8fr_0.7fr]"
                >
                  <div className="flex gap-3">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {order.productImage ? (
                        <Image
                          src={order.productImage}
                          alt={order.productTitle}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-100" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Order #{order.id.slice(-6)}</p>
                      <Link href={`/products/${order.productId}`} className="mt-1 block text-sm font-semibold text-slate-950 transition hover:text-slate-700">
                        {order.productTitle}
                      </Link>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                          Size: {order.size}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                          Color: {order.color}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                          Qty: {order.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{order.customer}</p>
                    <p className="mt-1">{order.phone}</p>
                    <p className="mt-1 line-clamp-2">{order.address}</p>
                    {order.note ? <p className="mt-2 text-xs text-slate-500">Note: {order.note}</p> : null}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.total}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.date}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-600">Payment: Online</p>
                  </div>

                  <div className="md:justify-self-end">
                    <AdminOrderStatusControl orderId={order.id} initialStatus={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
