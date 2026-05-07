import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import ReelsModel from "@/models/Reels";

export const runtime = "nodejs";
export const maxDuration = 60;

type UploadResult = {
  secure_url: string;
  optimized_url?: string;
};

const uploadBuffer = async (buffer: Buffer, fileName: string) => {
  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "style-sphere/reels",
        resource_type: "video",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        eager: [
          {
            format: "mp4",
            quality: "auto:eco",
            video_codec: "auto",
            width: 720,
            crop: "limit",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        const optimizedUrl = Array.isArray(result.eager) && result.eager[0]?.secure_url
          ? result.eager[0].secure_url
          : undefined;
        resolve({ secure_url: result.secure_url, optimized_url: optimizedUrl });
      }
    );

    uploadStream.end(buffer);
  });
};


export async function POST(request: Request){
    try{
        const formData = await request.formData();
        const productRef = String(formData.get("productRef") ?? "").trim();
        const videoFile = formData.get("video");

        if (!productRef || !(videoFile instanceof File)) {
            return NextResponse.json({ message: "Product and video are required" }, { status: 400 });
        }

        if (videoFile.size === 0) {
            return NextResponse.json({ message: "Selected video is empty" }, { status: 400 });
        }

        const arrayBuffer = await videoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadBuffer(buffer, videoFile.name);

        await dbConnect();

        const reels = await ReelsModel.findOneAndUpdate(
          { productRef },
            { video: uploadResult.optimized_url ?? uploadResult.secure_url, productRef },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ reels }, { status: 201 });
    } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
