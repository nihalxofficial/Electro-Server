import { Wishlist } from "./wishlist.model";
import { Product } from "../product/product.model";
import { ApiError } from "../../utils/apiError";

export async function getWishlistByUserId(userId: string) {
  return Wishlist.find({ userId }).populate("productId").sort({ createdAt: -1 });
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const existing = await Wishlist.findOne({ userId, productId });
  if (existing) return existing.populate("productId");

  const item = await Wishlist.create({ userId, productId });
  return item.populate("productId");
}

export async function removeFromWishlist(userId: string, productId: string) {
  const item = await Wishlist.findOneAndDelete({ userId, productId });
  if (!item) throw new ApiError(404, "Item not found in wishlist");
  return item;
}