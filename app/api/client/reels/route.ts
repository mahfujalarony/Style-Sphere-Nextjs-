import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReelsModel from "@/models/Reels";

export async function GET() {
  try {
    await dbConnect();

    const reels = await ReelsModel.find()
      .sort({ createdAt: -1 })
      .limit(12)
      .select("video productRef")
      .populate("productRef", "title")
      .lean();

    return NextResponse.json({ reels });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
