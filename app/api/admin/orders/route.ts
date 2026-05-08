import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import OrderModel from "@/models/Order";

const ALLOWED_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

type UpdateOrderRequest = {
  orderId?: string;
  status?: string;
};

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateOrderRequest;
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim().toLowerCase() : "";

    if (!orderId || !mongoose.isValidObjectId(orderId)) {
      return NextResponse.json({ message: "Valid orderId is required." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status as typeof ALLOWED_STATUSES[number])) {
      return NextResponse.json({ message: "Invalid status value." }, { status: 400 });
    }

    await dbConnect();

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ orderId: String(order._id), status: order.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
