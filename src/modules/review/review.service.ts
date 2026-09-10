import { Types } from "mongoose";
import { ProductReview } from "./review.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { CreateReviewInput, UpdateReviewInput, GetReviewsQuery } from "./review.validator";

function toIdQuery(id: string) {
  return Types.ObjectId.isValid(id) ? { $in: [id, new Types.ObjectId(id)] } : id;
}

export async function getReviews(query: GetReviewsQuery) {
  const { productId, userId, page, limit } = query;
  const filter: any = {};
  if (productId) filter.productId = toIdQuery(productId);
  if (userId) filter.userId = toIdQuery(userId);

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    ProductReview.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ProductReview.countDocuments(filter),
  ]);

  const userIds = reviews.map((r: any) => r.userId).filter(Boolean);
  const users = await User.find({
    _id: { $in: userIds.flatMap((id: any) => (Types.ObjectId.isValid(id) ? [id, new Types.ObjectId(id)] : [id])) },
  }).lean();
  const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

  const formattedReviews = reviews.map((r: any) => {
    const user = userMap.get(r.userId?.toString());
    return {
      id: r._id.toString(),
      productId: r.productId?.toString(),
      userId: r.userId?.toString(),
      userName: (user as any)?.name || "Anonymous",
      userAvatar: (user as any)?.image,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
    };
  });

  return {
    reviews: formattedReviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createReview(data: CreateReviewInput) {
  const review = await ProductReview.create(data);
  const user = await User.findById(data.userId).lean();
  await recalculateProductRating(data.productId);

  return {
    id: review._id.toString(),
    productId: review.productId?.toString(),
    userId: review.userId?.toString(),
    userName: (user as any)?.name || "Anonymous",
    userAvatar: (user as any)?.image,
    rating: review.rating,
    comment: review.comment,
    date: (review as any).createdAt,
  };
}

export async function updateReview(id: string, data: UpdateReviewInput) {
  const review = await ProductReview.findByIdAndUpdate(id, data, { new: true }).lean();
  if (data.rating !== undefined && review) await recalculateProductRating((review as any).productId.toString());
  return review;
}

export async function deleteReview(id: string) {
  const review = await ProductReview.findByIdAndDelete(id);
  if (review) await recalculateProductRating((review as any).productId.toString());
}

async function recalculateProductRating(productId: string) {
  const [stats] = await ProductReview.aggregate([
    { $match: { productId: toIdQuery(productId) } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats ? Math.round(stats.avgRating * 10) / 10 : undefined,
    reviewCount: stats?.count ?? 0,
  });
}