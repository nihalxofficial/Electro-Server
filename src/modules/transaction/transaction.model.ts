import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    method: { type: String, enum: ["cod", "bkash", "rocket", "nagad"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    reference: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);