import { Router } from "express"
import {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller"
import { protect } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"

const wishlistRouter = Router()
wishlistRouter.route("/").get(protect, setProductORUserIds, getWishlist)
wishlistRouter
  .route("/item")
  .post(protect, setProductORUserIds, addItemToWishlist)
  .delete(protect, setProductORUserIds, removeItemFromWishlist)
export default wishlistRouter
