import { Router } from "express"
import {
  createOrder,
  getAllUserOrders,
  getOrder,
} from "../controllers/order.controller"
import { protect } from "../controllers/auth.controller"
import { setProductUserIds } from "../controllers/review.controller"

const orderRouter = Router()

orderRouter
  .route("/")
  .post(protect, setProductUserIds, createOrder)
  .get(protect, setProductUserIds, getAllUserOrders)

orderRouter.route("/:id").get(protect, getOrder)
export default orderRouter
