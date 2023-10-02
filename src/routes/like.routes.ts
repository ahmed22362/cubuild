import { Router } from "express"
import { addLike, removeLike } from "../controllers/like.controller"
import { protect } from "../controllers/auth.controller"
import { setUserReviewIds } from "../controllers/like.controller"
import validate from "../middleware/validateSchema"
import { addLikeSchema, deleteLikeSchema } from "../schema/like.schema"
const LikeRouter = Router({ mergeParams: true })

LikeRouter.route("/")
  .post(protect, setUserReviewIds, validate(addLikeSchema), addLike)
  .delete(protect, setUserReviewIds, validate(deleteLikeSchema), removeLike)

export default LikeRouter
