import { Router } from "express"
import {
  createOrder,
  getAllUserOrders,
  getOrder,
} from "../controllers/order.controller"
import { protect } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"
import {
  createOrderSchema,
  getOrderSchema,
  getUserOrdersSchema,
} from "../schema/order.schema"
import validate from "../middleware/validateSchema"

const orderRouter = Router()

orderRouter
  .route("/")
  .post(protect, setProductORUserIds, validate(createOrderSchema), createOrder)
  .get(
    protect,
    setProductORUserIds,
    validate(getUserOrdersSchema),
    getAllUserOrders
  )

orderRouter.route("/:id").get(protect, validate(getOrderSchema), getOrder)
export default orderRouter
