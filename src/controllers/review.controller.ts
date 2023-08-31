import { Response, NextFunction } from "express"
import ReviewModel from "../models/review.model"
import { IRequestWithUser } from "./auth.controller"
import {
  createOne,
  updateOne,
  getOne,
  getAll,
  deleteOne,
} from "./factory.controller"

export const setProductUserIds = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.product) req.body.product = req.params.productId
  if (!req.body.user) req.body.user = req.user?.id
  next()
}

export const getReviews = getAll(ReviewModel)
export const getReview = getOne(ReviewModel)
export const createReview = createOne(ReviewModel)
export const updateReview = updateOne(ReviewModel)
export const deleteReview = deleteOne(ReviewModel)
