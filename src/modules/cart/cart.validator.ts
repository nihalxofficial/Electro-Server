import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const addToCartSchema = z.object({
  userId: objectId,
  productId: objectId,
  quantity: z.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
  userId: objectId,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;