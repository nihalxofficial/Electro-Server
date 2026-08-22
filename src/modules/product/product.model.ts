import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategoryId: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);