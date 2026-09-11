import { Cart } from "./cart.model";
import { Product } from "../product/product.model";
import { ApiError } from "../../utils/apiError";

async function buildCartResponse(cart: any) {
  const populated = await cart.populate("items.productId");

  let subtotal = 0;
  const items = populated.items.map((item: any) => {
    const product = item.productId;
    const lineTotal = product ? product.price * item.quantity : 0;
    subtotal += lineTotal;
    return { product, quantity: item.quantity, lineTotal };
  });

  return {
    userId: populated.userId,
    items,
    subtotal,
    itemCount: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
  };
}

export async function getCart(userId: string) {
  const cart = await Cart.findOne({ userId });
  if (!cart) return { userId, items: [], subtotal: 0, itemCount: 0 };
  return buildCartResponse(cart);
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [{ productId, quantity }] });
  } else {
    const existingItem = cart.items.find((i) => i.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity } as any);
    }
    await cart.save();
  }

  return buildCartResponse(cart);
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found in cart");

  item.quantity = quantity;
  await cart.save();

  return buildCartResponse(cart);
}

export async function removeFromCart(userId: string, productId: string) {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true }
  );
  if (!cart) throw new ApiError(404, "Cart not found");

  return buildCartResponse(cart);
}

export async function clearCart(userId: string) {
  const cart = await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });
  if (!cart) throw new ApiError(404, "Cart not found");

  return buildCartResponse(cart);
}