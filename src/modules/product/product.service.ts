import { Product } from "./product.model";
import { Category } from "../category/category.model";
import { SubCategory } from "../subcategory/subcategory.model";
import { ApiError } from "../../utils/apiError";
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from "./product.validator";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Adds computed fields (id, discountPercentage, categories)
function formatProduct(product: any) {
  const obj = product.toObject ? product.toObject() : product;

  const discountPercentage =
    obj.originalPrice && obj.originalPrice > obj.price
      ? Math.round(((obj.originalPrice - obj.price) / obj.originalPrice) * 100)
      : undefined;

  const categoryName = obj.categoryId?.name || obj.specifications?.Category || "";
  const categories = categoryName ? [categoryName] : [];

  return {
    ...obj,
    id: obj._id?.toString() ?? obj.id,
    categories,
    discountPercentage,
  };
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
  return formatProduct(product);
}

export async function getProducts(query: GetProductsQuery) {
  const { category, subCategory, search, minPrice, maxPrice, isFeatured, inStock, sort, page, limit } = query;
  const conditions: any[] = [];

  // 1. Filter by category (by slug or name)
  if (category) {
    const cat = await Category.findOne({ $or: [{ slug: category }, { name: category }] });
    const catName = cat?.name || category.replace(/-/g, " ");
    const catRegex = new RegExp(`^${escapeRegex(catName)}$`, "i");

    const catOr: any[] = [
      { "specifications.Category": catRegex },
      { "specifications.category": catRegex },
    ];
    if (cat) catOr.push({ categoryId: cat._id });

    conditions.push({ $or: catOr });
  }

  // 2. Filter by subcategory (by slug or name)
  if (subCategory) {
    const sub = await SubCategory.findOne({ $or: [{ slug: subCategory }, { name: subCategory }] });
    const subName = sub?.name || subCategory.replace(/-/g, " ");
    const subRegex = new RegExp(`^${escapeRegex(subName)}$`, "i");

    const subOr: any[] = [
      { "specifications.Subcategory": subRegex },
      { "specifications.subcategory": subRegex },
    ];
    if (sub) subOr.push({ subCategoryIds: sub._id });

    conditions.push({ $or: subOr });
  }

  // 3. Search across title, description, badges, and specifications
  if (search?.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
    conditions.push({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { badges: searchRegex },
        { "specifications.$**": searchRegex },
      ],
    });
  }

  // 4. Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined) priceFilter.$gte = minPrice;
    if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
    conditions.push({ price: priceFilter });
  }

  // 4.5. Discount range filter (e.g. "0-20", "20-40")
  if (query.discount || query.minDiscount !== undefined || query.maxDiscount !== undefined) {
    const [minStr, maxStr] = (query.discount || "").split("-");
    const min = query.minDiscount ?? (minStr ? Number(minStr) : 0);
    const max = query.maxDiscount ?? (maxStr ? Number(maxStr) : 100);

    const discountExpr = {
      $cond: [
        { $and: [{ $gt: ["$originalPrice", "$price"] }, { $gt: ["$originalPrice", 0] }] },
        { $round: [{ $multiply: [{ $divide: [{ $subtract: ["$originalPrice", "$price"] }, "$originalPrice"] }, 100] }, 0] },
        { $ifNull: ["$discountPercentage", 0] },
      ],
    };
    conditions.push({ $expr: { $and: [{ $gte: [discountExpr, min] }, { $lte: [discountExpr, max] }] } });
  }

  // 4.6. Badge filter (e.g. "trending", "popular")
  const activeBadge = query.badge || query.badges;
  if (activeBadge?.trim()) {
    const badgeRegex = new RegExp(`^${escapeRegex(activeBadge.trim())}$`, "i");
    conditions.push({ badges: badgeRegex });
  }

  // 5. Boolean filters
  if (isFeatured !== undefined) conditions.push({ isFeatured });
  if (inStock !== undefined) conditions.push({ inStock });

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  // 6. Sorting
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
    newest: { createdAt: -1 },
  };
  const sortCriteria = sortMap[sort ?? ""] ?? { createdAt: -1 };

  // 7. Pagination with populated category and subcategories
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name slug")
      .populate("subCategoryIds", "name slug")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map(formatProduct),
    total,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new ApiError(404, "Product not found");
  return formatProduct(product);
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
}