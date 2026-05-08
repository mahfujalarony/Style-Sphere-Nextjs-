import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import OrderClient from "@/components/OrderClient";
import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Products";

type OrderPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const normalizeParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;
  const productId = normalizeParam(params.productId);

  if (!productId) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">No product selected</h1>
            <p className="mt-3 text-sm text-slate-600">Please choose a product before placing an order.</p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  await dbConnect();
  const product = await ProductModel.findById(productId).lean();

  if (!product) notFound();

  const color = normalizeParam(params.color) ?? null;
  const size = normalizeParam(params.size) ?? null;
  const qty = Math.max(Number(normalizeParam(params.qty)) || 1, 1);
  const phonePrefill = normalizeParam(params.phone) ?? null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <OrderClient
          productId={String(product._id)}
          productTitle={product.title}
          productImage={product.images?.[0] ?? ""}
          unitPrice={product.discountPrice}
          originalPrice={product.originalPrice}
          quantity={qty}
          color={color}
          size={size}
          phonePrefill={phonePrefill}
        />
      </section>
    </main>
  );
}
