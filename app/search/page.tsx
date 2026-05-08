import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Products";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q ?? "";
  const query = rawQuery.trim();

  let results: Array<{
    _id: string;
    title: string;
    image: string;
    originalPrice: number;
    discountPrice: number;
    discountTag?: string;
  }> = [];

  if (query.length > 0) {
    await dbConnect();
    const regex = new RegExp(escapeRegex(query), "i");
    const products = await ProductModel.find({
      $or: [{ title: regex }, { description: regex }],
    })
      .select("title images originalPrice discountPrice discountTag")
      .limit(48)
      .lean();

    results = products.map((product) => ({
      _id: String(product._id),
      title: product.title,
      image: product.images?.[0] ?? "",
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      discountTag: product.discountTag ?? undefined,
    }));
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Search results</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            {query ? `Results for \"${query}\"` : "Start typing to search"}
          </h1>
          {query && (
            <p className="mt-2 text-sm text-slate-600">
              {results.length} item{results.length === 1 ? "" : "s"} found
            </p>
          )}
        </div>

        {query.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Try searching by product name, brand, or description keywords.
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No products matched your search. Try a shorter or different keyword.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`} className="block">
                <ProductCard
                  image={product.image}
                  title={product.title}
                  originalPrice={product.originalPrice}
                  discountPrice={product.discountPrice}
                  discountTag={product.discountTag}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
