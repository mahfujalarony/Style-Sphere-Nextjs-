import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";


const ReelsSchema = new Schema(
    {
        video: { type: String, required: true },
        productRef: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    },
    {
        timestamps: true
    }
);

export type Reels = InferSchemaType<typeof ReelsSchema>;

const ReelsModel: Model<Reels> =
    mongoose.models.Reels || mongoose.model("Reels", ReelsSchema);

export default ReelsModel;
