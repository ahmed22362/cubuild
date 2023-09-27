import { Router } from "express"
import {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller"
import { protect } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"
import validate from "../middleware/validateSchema"
import {
  createWishListSchema,
  deleteProductFromWishlistSchema,
  getUserWishListSchema,
} from "../schema/wishlist.schema"

const wishlistRouter = Router()
wishlistRouter
  .route("/")
  .get(
    protect,
    setProductORUserIds,
    validate(getUserWishListSchema),
    getWishlist
  )
wishlistRouter
  .route("/item")
  .post(
    protect,
    setProductORUserIds,
    validate(createWishListSchema),
    addItemToWishlist
  )
  .delete(
    protect,
    setProductORUserIds,
    validate(deleteProductFromWishlistSchema),
    removeItemFromWishlist
  )
export default wishlistRouter
