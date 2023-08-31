import { Router } from "express"
import { createOrder } from "../controllers/order.controller"
import { protect } from "../controllers/auth.controller"
import { setProductUserIds } from "../controllers/review.controller"

const orderRouter = Router()

orderRouter.route("/").post(protect, setProductUserIds, createOrder)

export default orderRouter
