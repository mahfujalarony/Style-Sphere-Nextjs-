import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Products";

export async function GET() {
  try {
    await dbConnect();

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .limit(12)
      .select("title images originalPrice discountPrice discountTag")
      .lean();

    const sliderProducts = products.map((product) => ({
      ...product,
      image: product.images[0] ?? "",
    }));

    return NextResponse.json({ products: sliderProducts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
