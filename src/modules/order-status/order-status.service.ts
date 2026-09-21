import { OrderStatusLog } from "./order-status.model";

export type OrderStatusValue = "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export async function logOrderStatus(orderId: string, status: OrderStatusValue, note?: string) {
  return OrderStatusLog.create({ orderId, status, note });
}

export async function getOrderStatusHistory(orderId: string) {
  return OrderStatusLog.find({ orderId }).sort({ createdAt: 1 });
}