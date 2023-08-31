import { Router } from "express"
import {
  UpdateItemFromCart,
  addItemToCart,
  deleteAllItemsFromCart,
  deleteItemFromCart,
  getCart,
} from "../controllers/cart.controller"
import { protect } from "../controllers/auth.controller"
import { setProductUserIds } from "../controllers/review.controller"

const cartRouter = Router({ mergeParams: true })

cartRouter.get("/", protect, getCart)
cartRouter
  .route("/item/:itemId")
  .delete(protect, setProductUserIds, deleteItemFromCart)
  .patch(protect, setProductUserIds, UpdateItemFromCart)
cartRouter
  .route("/item")
  .post(protect, setProductUserIds, addItemToCart)
  .delete(protect, deleteAllItemsFromCart)
export default cartRouter
