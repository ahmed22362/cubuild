import { Router } from "express"
import validate from "../middleware/validateSchema"
import {
  createReviewSchema,
  getReviewSchema,
  removeReviewSchema,
  updateReviewSchema,
} from "../schema/review.schema"
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
  .get(validate(getReviewSchema), getReview)
  .patch(validate(updateReviewSchema), updateReview)
  .delete(validate(removeReviewSchema), deleteReview)
ReviewRouter.route("/")
  .get(getReviews)
  .post(
    protect,
    restrictTo("user"),
    setProductORUserIds,
    validate(createReviewSchema),
    createReview
  )

export default ReviewRouter
