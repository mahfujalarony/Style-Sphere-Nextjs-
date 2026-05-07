import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import ProductModel from "@/models/Products";
import CategoryModel from "@/models/Category";

export const runtime = "nodejs";

const uploadBuffer = async (buffer: Buffer, fileName: string) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "style-sphere/products",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );

    uploadStream.end(buffer);
  });
};

export async function GET() {
  try {
    await dbConnect();

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .select("title images discountPrice")
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "").trim();
    const originalPrice = Number(formData.get("originalPrice") ?? 0);
    const discountPrice = Number(formData.get("discountPrice") ?? 0);
    const discountTag = String(formData.get("discountTag") ?? "").trim();
    const colorsRaw = String(formData.get("colors") ?? "").trim();
    const sizesRaw = String(formData.get("sizes") ?? "").trim();

    const imageFiles = formData.getAll("images").filter((file) => file instanceof File) as File[];

    if (!title || !description || !categoryId || !originalPrice || !discountPrice || imageFiles.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const category = await CategoryModel.findById(categoryId).select("name slug").lean();
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 400 });
    }

    const uploadResults = await Promise.all(
      imageFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadBuffer(buffer, file.name);
        return result.secure_url;
      })
    );

    const parseList = (value: string) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const parseColors = (value: string) =>
      parseList(value).map((item) => item.toLowerCase());

    const product = await ProductModel.create({
      title,
      description,
      images: uploadResults,
      categoryRef: category._id,
      categorySlug: category.slug,
      categoryName: category.name,
      originalPrice,
      discountPrice,
      discountTag: discountTag || undefined,
      colors: parseColors(colorsRaw),
      sizes: parseList(sizesRaw),
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
