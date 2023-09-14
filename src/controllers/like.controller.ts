import { NextFunction, Response, Request } from "express"
import Like from "../models/like.model"
import { createOne, deleteOne } from "./factory.controller"
import { IRequestWithUser } from "./auth.controller"
import catchAsync from "../utils/catchAsync"

export const setUserReviewIds = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.params.reviewId) req.body.review = req.params.reviewId
  if (req.user) req.body.user = req.user.id
  next()
}

export const addLike = createOne(Like)
export const removeLike = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const helpful = await Like.findOneAndDelete({
      user: req.body.user,
      review: req.body.review,
    })
    if (!helpful) {
      return res.status(400).json({
        status: "fail",
        message: "Can't find that you liked this review!",
      })
    }
    res
      .status(200)
      .json({ status: "success", message: "helpful removed successfully!" })
  }
)
