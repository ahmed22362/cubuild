import { Router } from "express"
import validate from "../middleware/validateSchema"
import { createReviewSchema } from "../schema/review.schema"
import { protect, restrictTo } from "../controllers/auth.controller"
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  setProductORUserIds,
  deleteReview,
} from "../controllers/review.controller"
import LikeRouter from "./like.routes"
const ReviewRouter = Router({ mergeParams: true })

ReviewRouter.use("/:reviewId/helpful", LikeRouter)

ReviewRouter.route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview)
ReviewRouter.route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), setProductORUserIds, createReview)

export default ReviewRouter
