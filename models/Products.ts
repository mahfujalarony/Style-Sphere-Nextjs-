import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		images: { type: [String], required: true },
		categoryRef: { type: Schema.Types.ObjectId, ref: "Category", required: true },
		categorySlug: { type: String, required: true, trim: true },
		categoryName: { type: String, required: true, trim: true },
		originalPrice: { type: Number, required: true },
		discountPrice: { type: Number, required: true },
		discountTag: { type: String },
		colors: { type: [String], default: [] },
		sizes: { type: [String], default: [] },
		sizeGuide: { type: String, default: "" },
        sold: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export type Product = InferSchemaType<typeof ProductSchema>;

const ProductModel: Model<Product> =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default ProductModel;
