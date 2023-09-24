import { Request, Response, NextFunction } from "express"
import catchAsync from "../utils/catchAsync"
import PrintOrderModel from "../models/printOrder.model"
import AppError from "../utils/AppError"
import Paymob from "../payments/paymobStrategy"
import dotenv from "dotenv"
import { createHmac } from "crypto"

import { IRequestWithUser } from "./auth.controller"
import PaymobTransaction from "../models/paymob.transaction.model"
import OrderModel from "../models/order.model"
import { CustomOrderStatus } from "../models/printCart.model"
import User from "../models/user.model"
import Mail from "../utils/sendmail"
dotenv.config()

const API_TOKEN = process.env.PAYMOB_API as string
export const payOrder = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { orderId } = req.body
    let billingData = req.body.billingData
    let order = await PrintOrderModel.findById(orderId)
    if (!order) {
      order = await OrderModel.findById(orderId)
    }
    if (!order) {
      return next(new AppError(400, "can't find the order!"))
    }
    if (!billingData) {
      billingData = req.user?.billing
    }
    const iFrameLink = await new Paymob(API_TOKEN).payWithCard(
      order.totalCost,
      billingData,
      order.paymobOrderId
    )
    res.status(200).json({ status: "success", redirect_link: iFrameLink })
  }
)
export const payPostCallBack = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the transaction details from the request body
    const {
      amount_cents,
      created_at,
      currency,
      error_occured,
      has_parent_transaction,
      id,
      integration_id,
      is_3d_secure,
      is_auth,
      is_capture,
      is_refunded,
      is_standalone_payment,
      is_voided,
      order: { id: order_id },
      owner,
      pending,
      source_data: {
        pan: source_data_pan,
        sub_type: source_data_sub_type,
        type: source_data_type,
      },
      success,
    } = req.body.obj

    // Create a lexicographical string with the order specified by Paymob @ https://docs.paymob.com/docs/hmac-calculation
    let lexicographical =
      amount_cents +
      created_at +
      currency +
      error_occured +
      has_parent_transaction +
      id +
      integration_id +
      is_3d_secure +
      is_auth +
      is_capture +
      is_refunded +
      is_standalone_payment +
      is_voided +
      order_id +
      owner +
      pending +
      source_data_pan +
      source_data_sub_type +
      source_data_type +
      success
    const HMAC_KEY = process.env.PAYMOB_HMAC_KEY as string
    // Create a hash using the Lexicographical string and the HMAC key
    let hash = createHmac("sha512", HMAC_KEY)
      .update(lexicographical)
      .digest("hex")

    // Compare the hash with the hmac sent by Paymob to verify the request is authentic
    if (hash === req.query.hmac) {
      // the request is authentic and you can store in the db whtever you want
      const payment = new PaymobTransaction({
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order_id,
        owner,
        pending,
        source_data_pan,
        source_data_sub_type,
        source_data_type,
        success,
      })
      await payment.save()
      // update order status
      let order = await OrderModel.findOne({ paymobOrderId: order_id })
      if (!order) {
        order = await PrintOrderModel.findOne({ paymobOrderId: order_id })
      }
      if (!order) {
        return next(
          new AppError(
            400,
            "Theres is some thing wrong while updating order status!"
          )
        )
      }
      order.status = CustomOrderStatus.shipping
      await order.save()
      // send mail to the user abut the order
      const user = await User.findById(order.user)
      if (!user) {
        throw next(
          new AppError(400, "Can't find user connected with this order")
        )
      }
      await new Mail(user.email, user.name).sendConfirmOrder(
        order,
        order.totalCost
      )
      return res.sendStatus(200)
    }
    res.sendStatus(400)
  }
)
