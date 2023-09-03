import { Router } from "express"
import {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller"
import { protect } from "../controllers/auth.controller"
import { setProductUserIds } from "../controllers/review.controller"

const wishlistRouter = Router()
wishlistRouter.route("/").get(protect, setProductUserIds, getWishlist)
wishlistRouter
  .route("/item")
  .post(protect, setProductUserIds, addItemToWishlist)
  .delete(protect, setProductUserIds, removeItemFromWishlist)
export default wishlistRouter
