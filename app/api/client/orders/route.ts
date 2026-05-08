import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Products";

type OrderRequest = {
  productId?: string;
  color?: string | null;
  size?: string | null;
  quantity?: number;
  customerName?: string;
  phone?: string;
  address?: string;
  note?: string;
};

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const serializeOrder = (order: {
  _id: unknown;
  productTitle: string;
  productImage?: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status?: string;
  phone: string;
  customerName: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: String(order._id),
  productTitle: order.productTitle,
  productImage: order.productImage ?? "",
  color: order.selectedColor ?? "",
  size: order.selectedSize ?? "",
  quantity: order.quantity,
  unitPrice: order.unitPrice,
  total: order.total,
  status: order.status ?? "pending",
  phone: order.phone,
  customerName: order.customerName,
  address: order.address,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = normalizeText(searchParams.get("orderId"));
    const ids = normalizeText(searchParams.get("ids"))
      .split(",")
      .map((id) => id.trim())
      .filter((id) => mongoose.isValidObjectId(id));
    const phone = normalizeText(searchParams.get("phone"));

    const uniqueIds = Array.from(new Set([orderId, ...ids].filter((id) => mongoose.isValidObjectId(id))));

    if (uniqueIds.length === 0 && !phone) {
      return NextResponse.json({ orders: [] });
    }

    await dbConnect();

    const filters = [];
    if (uniqueIds.length > 0) filters.push({ _id: { $in: uniqueIds } });
    if (phone) filters.push({ phone });

    const orders = await OrderModel.find(filters.length > 1 ? { $or: filters } : filters[0])
      .sort({ createdAt: -1 })
      .select("productTitle productImage selectedColor selectedSize quantity unitPrice total status phone customerName address createdAt updatedAt")
      .lean();

    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const productId = normalizeText(body.productId);

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json({ message: "Valid productId is required." }, { status: 400 });
    }

    await dbConnect();

    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 99);
    const selectedColor = normalizeText(body.color);
    const selectedSize = normalizeText(body.size);

    if (product.colors?.length) {
      const availableColors = product.colors.map((color) => color.toLowerCase());
      if (!selectedColor) {
        return NextResponse.json({ message: "Color is required." }, { status: 400 });
      }
      if (!availableColors.includes(selectedColor.toLowerCase())) {
        return NextResponse.json({ message: "Selected color is not available." }, { status: 400 });
      }
    }

    if (product.sizes?.length) {
      const availableSizes = product.sizes.map((size) => size.toLowerCase());
      if (!selectedSize) {
        return NextResponse.json({ message: "Size is required." }, { status: 400 });
      }
      if (!availableSizes.includes(selectedSize.toLowerCase())) {
        return NextResponse.json({ message: "Selected size is not available." }, { status: 400 });
      }
    }

    const customerName = normalizeText(body.customerName);
    const phone = normalizeText(body.phone);
    const address = normalizeText(body.address);
    const note = normalizeText(body.note);

    if (!customerName || !phone || !address) {
      return NextResponse.json({ message: "Name, phone, and address are required." }, { status: 400 });
    }

    const unitPrice = product.discountPrice;
    const total = unitPrice * quantity;

    const order = await OrderModel.create({
      productRef: product._id,
      productTitle: product.title,
      productImage: product.images?.[0] ?? "",
      unitPrice,
      quantity,
      selectedColor,
      selectedSize,
      customerName,
      phone,
      address,
      note,
      total,
    });

    return NextResponse.json({ orderId: String(order._id) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
