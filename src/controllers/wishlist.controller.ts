import { Request, Response, NextFunction } from "express"
import catchAsync from "../utils/catchAsync"
import Wishlist, { IWishlist } from "../models/wishlist.model"
import AppError from "../utils/AppError"
import mongoose from "mongoose"

export const getWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.user
    const wishlist = await getOrCreateWishlist(userId)
    if (!wishlist) {
      return next(new AppError(400, "can't create or find wishlist"))
    }
    await wishlist.populate({
      path: "items.product",
      select: "title coverImage price",
    })
    res.status(200).json({ status: "success", data: wishlist })
  }
)

export const addItemToWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.user
    const productId = req.body.product

    const wishlist = await getOrCreateWishlist(userId)
    if (!wishlist) {
      return next(new AppError(400, "can't create or find wishlist"))
    }
    const existing = wishlist.items?.find(
      (item) => item.product.toString() === productId
    )

    if (existing) {
      // Already in wishlist, return error
      return next(new AppError(400, "Product already in wishlist"))
    }
    const newItem = {
      id: new mongoose.Types.ObjectId(),
      product: productId,
    }
    wishlist.items?.push(newItem)
    await wishlist.populate({
      path: "items.product",
      select: "title coverImage price",
    })
    await wishlist.save()
    res.status(200).json({ status: "success", data: wishlist })
  }
)

export const removeItemFromWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.user
    const productId = req.body.product

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      {
        new: true,
        upsert: true,
      }
    )
    if (!wishlist) {
      return next(new AppError(400, "can't create or find wishlist"))
    }
    wishlist.populate({
      path: "items.product",
      select: "title coverImage price",
    })

    res.status(200).json({
      status: "success",
      data: wishlist,
      message: "item deleted successfully",
    })
  }
)

async function getOrCreateWishlist(userId: string): Promise<IWishlist> {
  // Try to find existing wishlist
  let wishlist = await Wishlist.findOne({ user: userId })

  if (!wishlist) {
    // Wishlist not found, create a new one
    wishlist = new Wishlist({
      user: userId,
      items: [],
    })

    await wishlist.save()
  }

  return wishlist
}
