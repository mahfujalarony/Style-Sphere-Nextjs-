import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    href: { type: String, trim: true },
    group: {
      type: String,
      required: true,
      enum: ["inStore", "luxury", "nav"],
    },
    order: { type: Number, default: 0 },
    hasArrow: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Category = InferSchemaType<typeof CategorySchema>;

const CategoryModel: Model<Category> =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default CategoryModel;
