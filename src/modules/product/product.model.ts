import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },          
    slug: { type: String, required: true, unique: true },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategoryIds: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],

    price: { type: Number, required: true },
    originalPrice: { type: Number },
    // discountPercentage intentionally NOT stored — computed on read

    image: { type: String, required: true },           // main image
    additionalImages: [{ type: String }],               // gallery

    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number },

    rating: { type: Number },
    reviewCount: { type: Number },

    badges: [{ type: String }],   // plain strings for now, matches current form

    sku: { type: String },
    description: { type: String },
    specifications: { type: Map, of: String },  // Record<string, string>
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);