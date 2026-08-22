import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);