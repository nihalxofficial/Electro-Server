import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { Cart } from "../cart/cart.model";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/apiError";
import { CreateOrderInput, UpdateOrderStatusInput } from "./order.validator";
import { logOrderStatus } from "../order-status/order-status.service";
import { createTransaction, getLatestTransactionForOrder } from "../transaction/transaction.service";

const STANDARD_SHIPPING_FEE = 15.0;
const FREE_SHIPPING_THRESHOLD = 50.0;
const POINTS_PER_DOLLAR = 1;

export async function createOrder(data: CreateOrderInput) {
  if (data.paymentMethod !== "cod" && !data.transactionId) {
    throw new ApiError(400, "Transaction ID required for wallet payments");
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of data.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);

    if (product.stockQuantity != null && product.stockQuantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.title}`);
    }

    subtotal += product.price * item.quantity;
    orderItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      image: product.image || item.image || "",
    });
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;
  const pointsEarned = Math.floor(subtotal * POINTS_PER_DOLLAR);

  const order = await Order.create({
    userId: data.userId,
    items: orderItems,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    subtotal,
    shippingFee,
    totalAmount,
    pointsEarned,
  });

  const reference = data.paymentMethod === "cod" ? `COD-${order._id}` : data.transactionId!;
  await createTransaction({
    orderId: order._id.toString(),
    userId: data.userId,
    method: data.paymentMethod,
    amount: totalAmount,
    reference,
  });

  await logOrderStatus(order._id.toString(), "confirmed");

  for (const item of data.items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stockQuantity: -item.quantity } });
  }

  await Cart.deleteMany({ userId: data.userId });

  await User.findByIdAndUpdate(data.userId, { $inc: { points: pointsEarned } });

  return order;
}

export async function getOrdersByUserId(userId: string) {
  return Order.find({ userId }).populate("items.productId").sort({ createdAt: -1 });
}

export async function getOrderById(id: string) {
  const order = await Order.findById(id).populate("items.productId");
  if (!order) throw new ApiError(404, "Order not found");

  const transaction = await getLatestTransactionForOrder(id);

  return {
    ...order.toObject(),
    transactionId: transaction?.reference,
    paymentStatus: transaction?.status,
  };
}

export async function updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
  const order = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!order) throw new ApiError(404, "Order not found");

  await logOrderStatus(id, data.orderStatus);

  return order;
}