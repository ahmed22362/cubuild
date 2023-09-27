import { Router } from "express"
import { protect, restrictTo } from "../controllers/auth.controller"
import { setProductORUserIds } from "../controllers/review.controller"
import {
  createOrderPrint,
  deleteOrderPrint,
  getAllUserOrderPrint,
  getOneOrderPrint,
  updateOrderPrintStatus,
} from "../controllers/orderPrint.controller"
import validate from "../middleware/validateSchema"
import {
  createPrintOrderSchema,
  deleteUserPrintOrderSchema,
  getUserOnePrintOrderSchema,
  getUserPrintOrdersSchema,
  updateUserPrintOrderSchema,
} from "../schema/printOrder.schema"
const printOrderRouter = Router()

printOrderRouter
  .route("/")
  .post(
    protect,
    setProductORUserIds,
    validate(createPrintOrderSchema),
    createOrderPrint
  )
  .get(
    protect,
    setProductORUserIds,
    validate(getUserPrintOrdersSchema),
    getAllUserOrderPrint
  )

printOrderRouter
  .route("/:id")
  .get(protect, validate(getUserOnePrintOrderSchema), getOneOrderPrint)
  .patch(
    protect,
    restrictTo("admin"),
    validate(updateUserPrintOrderSchema),
    updateOrderPrintStatus
  )
  .delete(
    protect,
    restrictTo("admin"),
    validate(deleteUserPrintOrderSchema),
    deleteOrderPrint
  )

export default printOrderRouter
