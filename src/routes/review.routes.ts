import { Router } from "express"
import validate from "../middleware/validateSchema"
import { createReviewSchema } from "../schema/review.schema"
import { protect, restrictTo } from "../controllers/auth.controller"
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  setProductUserIds,
  deleteReview,
} from "../controllers/review.controller"
const ReviewRouter = Router({ mergeParams: true })

ReviewRouter.route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview)
ReviewRouter.route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), setProductUserIds, createReview)

export default ReviewRouter
