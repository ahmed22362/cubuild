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
const printOrderRouter = Router()

printOrderRouter
  .route("/")
  .post(protect, setProductORUserIds, createOrderPrint)
  .get(protect, setProductORUserIds, getAllUserOrderPrint)

printOrderRouter
  .route("/:id")
  .get(protect, getOneOrderPrint)
  .patch(protect, restrictTo("admin"), updateOrderPrintStatus)
  .delete(protect, restrictTo("admin"), deleteOrderPrint)

export default printOrderRouter
