import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export async function GET() {
  try {
    await dbConnect();

    const categories = await CategoryModel.find()
      .sort({ group: 1, order: 1, name: 1 })
      .select("name slug href group order hasArrow")
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      group?: "inStore" | "luxury" | "nav";
      order?: number;
    };

    const name = String(body.name ?? "").trim();
    const group = body.group ?? "nav";
    const slug = slugify(name);
    const order = Number.isFinite(body.order) ? Number(body.order) : 0;

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 });
    }

    await dbConnect();

    const category = await CategoryModel.create({
      name,
      slug,
      group,
      order,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Category id is required" }, { status: 400 });
    }

    await dbConnect();
    await CategoryModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
