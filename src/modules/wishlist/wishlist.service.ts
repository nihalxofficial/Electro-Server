import { Wishlist } from "./wishlist.model";
import { Product } from "../product/product.model";
import { ApiError } from "../../utils/apiError";

export async function getWishlist(userId: string) {
  const wishlist = await Wishlist.findOne({ userId }).populate("items");
  return wishlist ?? { userId, items: [] };
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { items: productId } },
    { new: true, upsert: true }
  ).populate("items");

  return wishlist;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { items: productId } },
    { new: true }
  ).populate("items");

  if (!wishlist) throw new ApiError(404, "Wishlist not found");
  return wishlist;
}