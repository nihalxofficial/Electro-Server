import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  categoryId: objectId,
  subCategoryId: objectId.optional(),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;