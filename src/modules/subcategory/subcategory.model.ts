import { Schema, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const SubCategory = model("SubCategory", subCategorySchema);