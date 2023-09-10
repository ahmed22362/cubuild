import { Router } from "express"
import {
  createOrder,
  getAllUserOrders,
  getOrder,
} from "../controllers/order.controller"
import { protect } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"

const orderRouter = Router()

orderRouter
  .route("/")
  .post(protect, setProductORUserIds, createOrder)
  .get(protect, setProductORUserIds, getAllUserOrders)

orderRouter.route("/:id").get(protect, getOrder)
export default orderRouter
