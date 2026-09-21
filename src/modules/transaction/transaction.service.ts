import { Transaction } from "./transaction.model";

export type PaymentMethod = "cod" | "bkash" | "rocket" | "nagad";

export async function createTransaction(params: {
  orderId: string;
  userId: string;
  method: PaymentMethod;
  amount: number;
  reference: string;
}) {
  return Transaction.create({
    ...params,
    status: params.method === "cod" ? "pending" : "success",
  });
}

export async function getLatestTransactionForOrder(orderId: string) {
  return Transaction.findOne({ orderId }).sort({ createdAt: -1 });
}

export async function getTransactions(filter: { userId?: string; orderId?: string }) {
  return Transaction.find(filter).sort({ createdAt: -1 });
}