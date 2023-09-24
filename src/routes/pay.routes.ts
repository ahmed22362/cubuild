import { Router } from "express"
import { payPostCallBack, payOrder } from "../controllers/pay.controller"
import { protect } from "../controllers/auth.controller"

const payRouter = Router()

payRouter.route("/order").post(protect, payOrder)
payRouter.route("/callBack").post(payPostCallBack)

export default payRouter
