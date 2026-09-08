import { Types } from "mongoose";
import { ProductReview } from "./review.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/apiError";
import { CreateReviewInput, UpdateReviewInput, GetReviewsQuery } from "./review.validator";

const USER_FIELDS = "name image";

function formatReview(review: any) {
  const obj = review.toObject ? review.toObject() : review;
  const user = obj.userId && typeof obj.userId === "object" ? obj.userId : null;

  return {
    id: obj._id?.toString() ?? obj.id,
    productId: obj.productId?.toString(),
    userId: user?._id?.toString() ?? obj.userId?.toString(),
    userName: user?.name ?? "Anonymous",
    userAvatar: user?.image,
    rating: obj.rating,
    comment: obj.comment,
    date: obj.createdAt,
  };
}

async function recalculateProductRating(productId: string) {
  const [stats] = await ProductReview.aggregate([
    { $match: { productId: new Types.ObjectId(productId) } },
    { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats ? Math.round(stats.avgRating * 10) / 10 : undefined,
    reviewCount: stats?.count ?? 0,
  });
}

export async function createReview(data: CreateReviewInput) {
  const product = await Product.findById(data.productId);
  if (!product) throw new ApiError(404, "Product not found");

  const user = await User.findById(data.userId);
  if (!user) throw new ApiError(404, "User not found");

  const review = await ProductReview.create(data);
  await review.populate("userId", USER_FIELDS);
  await recalculateProductRating(data.productId);

  return formatReview(review);
}

export async function getReviews(query: GetReviewsQuery) {
  const { productId, page, limit } = query;
  const filter: Record<string, any> = {};
  if (productId) filter.productId = productId;

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    ProductReview.find(filter)
      .populate("userId", USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ProductReview.countDocuments(filter),
  ]);

  return {
    reviews: reviews.map(formatReview),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateReview(id: string, data: UpdateReviewInput) {
  const review = await ProductReview.findByIdAndUpdate(id, data, { new: true }).populate(
    "userId",
    USER_FIELDS
  );
  if (!review) throw new ApiError(404, "Review not found");

  if (data.rating !== undefined) {
    await recalculateProductRating(review.productId.toString());
  }

  return formatReview(review);
}

export async function deleteReview(id: string) {
  const review = await ProductReview.findByIdAndDelete(id);
  if (!review) throw new ApiError(404, "Review not found");

  await recalculateProductRating(review.productId.toString());
}