import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const orderItemInputSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1),
});

const shippingAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export const createOrderSchema = z.object({
  userId: objectId,
  items: z.array(orderItemInputSchema).min(1, "Order must have at least one item"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "bkash", "rocket", "nagad"]),
  transactionId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;