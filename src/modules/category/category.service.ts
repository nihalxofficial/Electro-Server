import { Category } from "./category.model";
import { SubCategory } from "@/modules/subcategory/subcategory.model";
import { Product } from "@/modules/product/product.model";
import { ApiError } from "@/utils/apiError";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.validator";

interface GetCategoriesFilter {
  isActive?: boolean;
}


export async function createCategory(data: CreateCategoryInput) {
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, "Slug already in use");
  return Category.create(data);
}

export async function getCategories(filterInput: GetCategoriesFilter = {}) {
  const filter: Record<string, any> = {};
  if (filterInput.isActive !== undefined){
    filter.isActive = filterInput.isActive;
  } 
  return Category.find(filter).sort({ createdAt: -1 });
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
}

export async function deleteCategory(id: string) {
  const subIds = await SubCategory.find({ categoryId: id }).distinct("_id");
  const productCount = await Product.countDocuments({
    $or: [{ categoryId: id }, { subCategoryIds: { $in: subIds } }],
  });
  if (productCount > 0) throw new ApiError(400, "Cannot delete category with active products");

  await SubCategory.deleteMany({ categoryId: id });
  await Category.findByIdAndDelete(id);
}