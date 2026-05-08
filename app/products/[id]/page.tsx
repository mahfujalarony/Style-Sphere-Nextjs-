import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductDetailsGallery from "@/components/ProductDetailsGallery";
import dbConnect from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import ProductModel from "@/models/Products";
import ProductPageClient from "../../../components/Productpageclient";
import ProductOrderPanel from "@/components/ProductOrderPanel";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const isObjectId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);

const normalizeArray = (value: string | string[] | undefined) => {
  if (!value) return [] as string[];
  return Array.isArray(value) ? value : [value];
};

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const queryParams = await searchParams;

  await dbConnect();

  // ── Single product view ──────────────────────────────────────────────────
  if (isObjectId(id)) {
    const product = await ProductModel.findById(id).lean();
    if (!product) notFound();

    const images = product.images ?? [];
    const relatedProducts = await ProductModel.find({
      categoryRef: product.categoryRef,
      _id: { $ne: product._id },
    })
      .sort({ createdAt: -1 })
      .select("title images originalPrice discountPrice discountTag")
      .limit(8)
      .lean();

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-12 lg:pb-16">
          <ProductDetailsGallery images={images} title={product.title} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Link href={`/products/${product.categorySlug}`} className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-950">
              {product.categoryName}
            </Link>
            {product.discountTag && (
              <p className="mt-4 inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {product.discountTag}
              </p>
            )}
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">{product.title}</h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-950">Tk {product.discountPrice.toLocaleString()}</span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-lg text-slate-400 line-through">Tk {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-600">{product.description}</p>
            <ProductOrderPanel
              productId={String(product._id)}
              colors={product.colors ?? []}
              sizes={product.sizes ?? []}
              sizeGuide={product.sizeGuide ?? ""}
            />
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Related Products</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">You may also like</h2>
              </div>
              <Link href={`/products/${product.categorySlug}`} className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
                View category
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link key={String(item._id)} href={`/products/${String(item._id)}`} className="block">
                  <ProductCard
                    image={item.images?.[0] ?? ""}
                    title={item.title}
                    originalPrice={item.originalPrice}
                    discountPrice={item.discountPrice}
                    discountTag={item.discountTag ?? undefined}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  }

  // ── Category listing ─────────────────────────────────────────────────────
  const category = await CategoryModel.findOne({ slug: id }).lean();
  if (!category) notFound();

  const selectedColors = normalizeArray(queryParams.color).map((v) => v.toLowerCase());
  const selectedSizes = normalizeArray(queryParams.size);
  const sortValue = String(queryParams.sort ?? "newest");

  const priceRange = await ProductModel.aggregate([
    { $match: { categoryRef: category._id } },
    { $group: { _id: null, min: { $min: "$discountPrice" }, max: { $max: "$discountPrice" } } },
  ]);

  const minPrice = priceRange[0]?.min ?? 0;
  const maxPrice = priceRange[0]?.max ?? 0;
  const requestedMin = Number(queryParams.min);
  const requestedMax = Number(queryParams.max);
  const minValue =
    Number.isFinite(requestedMin) && requestedMin > minPrice ? Math.min(requestedMin, maxPrice) : minPrice;
  const maxValue =
    Number.isFinite(requestedMax) && requestedMax < maxPrice ? Math.max(requestedMax, minPrice) : maxPrice;

  const filter: Record<string, unknown> = { categoryRef: category._id };

  if (selectedColors.length > 0) filter.colors = { $in: selectedColors };
  if (selectedSizes.length > 0) filter.sizes = { $in: selectedSizes };

  const hasMin = minValue > minPrice;
  const hasMax = maxValue < maxPrice;
  if (hasMin || hasMax) {
    filter.discountPrice = {} as { $gte?: number; $lte?: number };
    if (hasMin) (filter.discountPrice as { $gte?: number }).$gte = minValue;
    if (hasMax) (filter.discountPrice as { $lte?: number }).$lte = maxValue;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { discountPrice: 1 },
    "price-desc": { discountPrice: -1 },
  };

  const products = await ProductModel.find(filter)
    .sort(sortMap[sortValue] ?? sortMap.newest)
    .select("title images originalPrice discountPrice discountTag")
    .limit(60)
    .lean();

  const colors = (await ProductModel.distinct("colors", { categoryRef: category._id }))
    .map((v) => String(v).toLowerCase())
    .filter(Boolean)
    .sort();

  const sizes = (await ProductModel.distinct("sizes", { categoryRef: category._id }))
    .map((v) => String(v))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  // Serialize for client component
  const serializedProducts = products.map((p) => ({
    _id: String(p._id),
    title: p.title,
    images: p.images ?? [],
    originalPrice: p.originalPrice,
    discountPrice: p.discountPrice,
    discountTag: p.discountTag ?? null,
  }));

  return (
    <ProductPageClient
      slug={id}
      categoryName={category.name}
      products={serializedProducts}
      colors={colors}
      sizes={sizes}
      selectedColors={selectedColors}
      selectedSizes={selectedSizes}
      sortValue={sortValue}
      minValue={minValue}
      maxValue={maxValue}
      minPrice={minPrice}
      maxPrice={maxPrice}
    />
  );
}
