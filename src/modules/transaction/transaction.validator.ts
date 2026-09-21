import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const getTransactionsQuerySchema = z.object({
  userId: objectId.optional(),
  orderId: objectId.optional(),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;