import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import PrintOrderModel from "../models/printOrder.model"
import PrintCartModel, { CustomOrderStatus } from "../models/printCart.model"
import AppError from "../utils/AppError"
import { deleteOne, getAll, getOne, updateOne } from "./factory.controller"
import Paymob from "../payments/paymobStrategy"
import dotenv from "dotenv"
dotenv.config()

const API_TOKEN = process.env.PAYMOB_API as string

export const createOrderPrint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId, user, shipping, shippingPrice } = req.body
    const cartItem = await PrintCartModel.findById(itemId)
    if (!cartItem)
      return next(new AppError(400, "can't find item with this id!"))
    if (cartItem.status === CustomOrderStatus.Pending)
      return next(
        new AppError(400, "Can't create order for item is not processed!")
      )
    const totalCost = cartItem.price + (shipping ? shippingPrice : 0)
    // convert my item schema to the paymob order items schema
    const paymob_order_items = [
      {
        name: cartItem.files[0].fileName,
        amount_cents: cartItem.price,
        description: cartItem.description || "",
        quantity: cartItem.quantity,
      },
    ]
    try {
      const paymobOrderId = await new Paymob(API_TOKEN).registerOrder(
        paymob_order_items,
        totalCost
      )
      console.log("after creating the ppaymob order")
      const orderItem = {
        user,
        shipping,
        shippingPrice,
        printCost: cartItem.price,
        totalCost: totalCost,
        files: cartItem.files,
        paymobOrderId,
      }

      const printOrder = await PrintOrderModel.create(orderItem)
      if (!printOrder)
        return next(
          new AppError(400, "can't create new order something wrong happened!")
        )
      await PrintCartModel.findOneAndDelete(cartItem._id)
      res.status(200).json({ status: "success", data: printOrder })
    } catch (err: any) {
      return next(new AppError(err.statusCode, err.message))
    }
  }
)
export const deleteOrderPrint = deleteOne(PrintOrderModel)
export const getAllUserOrderPrint = getAll(PrintOrderModel)
export const getOneOrderPrint = getOne(PrintOrderModel)
export const updateOrderPrintStatus = updateOne(PrintOrderModel)
