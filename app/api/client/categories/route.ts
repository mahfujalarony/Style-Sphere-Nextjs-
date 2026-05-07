import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

const emptyCategories = {
  inStore: [] as Array<{ name: string; href: string; group: string; hasArrow?: boolean }>,
  luxury: [] as Array<{ name: string; href: string; group: string; hasArrow?: boolean }>,
  nav: [] as Array<{ name: string; href: string; group: string; hasArrow?: boolean }>,
};

export async function GET() {
  try {
    await dbConnect();

    const categories = await CategoryModel.find()
      .sort({ group: 1, order: 1, name: 1 })
      .select("name slug href group order hasArrow")
      .lean();

    if (categories.length === 0) {
      return NextResponse.json({ categories: emptyCategories });
    }

    const grouped = {
      inStore: [] as typeof categories,
      luxury: [] as typeof categories,
      nav: [] as typeof categories,
    };

    categories.forEach((item) => {
      grouped[item.group as "inStore" | "luxury" | "nav"].push(item);
    });

    const toClient = (items: typeof categories) =>
      items.map((item) => ({
        name: item.name,
        href: item.href || `/products/${encodeURIComponent(item.slug)}`,
        group: item.group,
        hasArrow: item.hasArrow,
      }));

    return NextResponse.json({
      categories: {
        inStore: toClient(grouped.inStore),
        luxury: toClient(grouped.luxury),
        nav: toClient(grouped.nav),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
