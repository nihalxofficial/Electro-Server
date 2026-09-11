import { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevents the same user from wishlisting the same product twice
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Wishlist = model("Wishlist", wishlistSchema);