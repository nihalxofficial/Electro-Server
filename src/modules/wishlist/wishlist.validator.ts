import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const wishlistActionSchema = z.object({
  userId: objectId,
  productId: objectId,
});

export type WishlistActionInput = z.infer<typeof wishlistActionSchema>;