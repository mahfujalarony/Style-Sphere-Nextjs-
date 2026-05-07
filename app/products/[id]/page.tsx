import { notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import ProductModel from "@/models/Products";
import ProductPageClient from "../../../components/Productpageclient";

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
    const firstImage = images[0];

    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
          <div className="grid gap-4">
            {firstImage && (
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img src={firstImage} alt={product.title} className="aspect-[4/5] w-full object-cover" />
              </div>
            )}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((image) => (
                  <img key={image} src={image} alt={product.title} className="aspect-square rounded-xl object-cover" />
                ))}
              </div>
            )}
          </div>
          <div className="lg:pt-8">
            {product.discountTag && (
              <p className="mb-3 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {product.discountTag}
              </p>
            )}
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{product.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-950">Tk {product.discountPrice}</span>
              <span className="text-lg text-slate-400 line-through">Tk {product.originalPrice}</span>
            </div>
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-600">{product.description}</p>
            <button className="mt-8 rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add to Cart
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ── Category listing ─────────────────────────────────────────────────────
  const category = await CategoryModel.findOne({ slug: id }).lean();
  if (!category) notFound();

  const selectedColors = normalizeArray(queryParams.color).map((v) => v.toLowerCase());
  const selectedSizes = normalizeArray(queryParams.size);
  const minValue = Number(queryParams.min);
  const maxValue = Number(queryParams.max);
  const sortValue = String(queryParams.sort ?? "newest");

  const filter: Record<string, unknown> = { categoryRef: category._id };

  if (selectedColors.length > 0) filter.colors = { $in: selectedColors };
  if (selectedSizes.length > 0) filter.sizes = { $in: selectedSizes };

  const hasMin = Number.isFinite(minValue) && minValue > 0;
  const hasMax = Number.isFinite(maxValue) && maxValue > 0;
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

  const priceRange = await ProductModel.aggregate([
    { $match: { categoryRef: category._id } },
    { $group: { _id: null, min: { $min: "$discountPrice" }, max: { $max: "$discountPrice" } } },
  ]);

  const minPrice = priceRange[0]?.min ?? 0;
  const maxPrice = priceRange[0]?.max ?? 0;

  const colors = (await ProductModel.distinct("colors", { categoryRef: category._id }))
    .map((v) => String(v).toLowerCase())
    .filter(Boolean)
    .sort();

  const sizes = (await ProductModel.distinct("sizes", { categoryRef: category._id }))
    .map((v) => String(v))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b));

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