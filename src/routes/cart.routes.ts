import { Router } from "express"
import {
  UpdateItemFromCart,
  addItemToCart,
  deleteAllItemsFromCart,
  deleteItemFromCart,
  getCart,
} from "../controllers/cart.controller"
import { protect } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"
import validate from "../middleware/validateSchema"
import {
  AddItemToCartSchema,
  deleteItemFromCartSchema,
  getCartSchema,
  updateItemFromCartSchema,
} from "../schema/cart.schema"

const cartRouter = Router({ mergeParams: true })

cartRouter.get(
  "/",
  protect,
  setProductORUserIds,
  validate(getCartSchema),
  getCart
)
cartRouter
  .route("/item/:itemId")
  .delete(
    protect,
    setProductORUserIds,
    validate(deleteItemFromCartSchema),
    deleteItemFromCart
  )
  .patch(
    protect,
    setProductORUserIds,
    validate(updateItemFromCartSchema),
    UpdateItemFromCart
  )
cartRouter
  .route("/item")
  .post(
    protect,
    setProductORUserIds,
    validate(AddItemToCartSchema),
    addItemToCart
  )
  .delete(protect, deleteAllItemsFromCart)
export default cartRouter
