import { Product } from "./product.model";
import { Category } from "@/modules/category/category.model";
import { ApiError } from "@/utils/apiError";
import { CreateProductInput, UpdateProductInput } from "./product.validator";

export async function createProduct(data: CreateProductInput) {
  const category = await Category.findById(data.categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  const existing = await Product.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, "Slug already in use");

  return Product.create(data);
}

export async function getProducts(categoryId?: string) {
  const filter = categoryId ? { categoryId } : {};
  return Product.find(filter).sort({ createdAt: -1 });
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
}