import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderSchema = new Schema(
  {
    productRef: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true, trim: true },
    productImage: { type: String, default: "" },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedColor: { type: String, default: "" },
    selectedSize: { type: String, default: "" },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    status: { type: String, default: "pending" },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof OrderSchema>;

const OrderModel: Model<Order> = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
