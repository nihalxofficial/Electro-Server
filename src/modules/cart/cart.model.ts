import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

// One cart row per user+product — quantity is updated in place, not duplicated
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Cart = model("Cart", cartSchema);