import { Product } from "./product.model";
import { Category } from "@/modules/category/category.model";
import { SubCategory } from "@/modules/subcategory/subcategory.model";
import { ApiError } from "@/utils/apiError";
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from "./product.validator";


function withDiscount(product: any) {
  const obj = product.toObject ? product.toObject() : product;
  const discountPercentage =
    obj.originalPrice && obj.originalPrice > obj.price
      ? Math.round(((obj.originalPrice - obj.price) / obj.originalPrice) * 100)
      : undefined;
  return { ...obj, discountPercentage };
}

export async function createProduct(data: CreateProductInput) {
  const category = await Category.findById(data.categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  if (data.subCategoryIds?.length) {
    const count = await SubCategory.countDocuments({ _id: { $in: data.subCategoryIds } });
    if (count !== data.subCategoryIds.length) {
      throw new ApiError(404, "One or more subcategories not found");
    }
  }

  const existing = await Product.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, "Slug already in use");

  const product = await Product.create(data);
  return withDiscount(product);
}

export async function getProducts(query: GetProductsQuery) {
  const { categoryId, subCategoryId, search, minPrice, maxPrice, page, limit } = query;

  const filter: Record<string, any> = {};
  if (categoryId) filter.categoryId = categoryId;
  if (subCategoryId) filter.subCategoryIds = subCategoryId; 
  if (search) filter.title = { $regex: search, $options: "i" };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map(withDiscount),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new ApiError(404, "Product not found");
  return withDiscount(product);
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
}