import { Cart } from "./cart.model";
import { Product } from "../product/product.model";
import { ApiError } from "../../utils/apiError";

export async function getCartByUserId(userId: string) {
  const items = await Cart.find({ userId }).populate("productId").sort({ createdAt: -1 });

  let subtotal = 0;
  const formatted = items.map((item: any) => {
    const product = item.productId;
    const lineTotal = product ? product.price * item.quantity : 0;
    subtotal += lineTotal;
    return {
      id: item._id,
      product,
      quantity: item.quantity,
      lineTotal,
    };
  });

  return {
    items: formatted,
    subtotal,
    itemCount: formatted.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const existing = await Cart.findOne({ userId, productId });
  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return existing.populate("productId");
  }

  const item = await Cart.create({ userId, productId, quantity });
  return item.populate("productId");
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const item = await Cart.findOneAndUpdate(
    { userId, productId },
    { quantity },
    { new: true }
  ).populate("productId");

  if (!item) throw new ApiError(404, "Item not found in cart");
  return item;
}

export async function removeFromCart(userId: string, productId: string) {
  const item = await Cart.findOneAndDelete({ userId, productId });
  if (!item) throw new ApiError(404, "Item not found in cart");
  return item;
}

export async function clearCart(userId: string) {
  await Cart.deleteMany({ userId });
}