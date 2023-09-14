import { Router } from "express"
import { addLike, removeLike } from "../controllers/like.controller"
import { protect } from "../controllers/auth.controller"
import { setUserReviewIds } from "../controllers/like.controller"
const LikeRouter = Router({ mergeParams: true })

LikeRouter.route("/")
  .post(protect, setUserReviewIds, addLike)
  .delete(protect, setUserReviewIds, removeLike)

export default LikeRouter
