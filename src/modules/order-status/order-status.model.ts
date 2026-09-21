import { Schema, model } from "mongoose";

const orderStatusSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    status: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
      required: true,
    },
    note: { type: String },
  },
  { timestamps: true }
);

export const OrderStatusLog = model("OrderStatusLog", orderStatusSchema);