import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import PrintOrderModel from "../models/printOrder.model"
import PrintCartModel, { CustomOrderStatus } from "../models/printCart.model"
import AppError from "../utils/AppError"
import { deleteOne, getAll, getOne, updateOne } from "./factory.controller"

export const createOrderPrint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId, user, shipping, shippingPrice } = req.body
    const cartItem = await PrintCartModel.findById(itemId)
    console.log(cartItem)
    if (!cartItem)
      return next(new AppError(400, "can't find item with this id!"))
    if (cartItem.status === CustomOrderStatus.Pending)
      return next(
        new AppError(400, "Can't create order for item is not processed!")
      )
    // console.log(req.body, cartItem.price + (shipping ? shippingPrice : 0))
    const orderItem = {
      user,
      shipping,
      shippingPrice,
      printCost: cartItem.price,
      totalCost: cartItem.price + (shipping ? shippingPrice : 0),
      files: cartItem.files,
    }
    const printOrder = await PrintOrderModel.create(orderItem)
    if (!printOrder)
      return next(
        new AppError(400, "can't create new order something wrong happened!")
      )
    await PrintCartModel.findOneAndDelete(cartItem._id)
    res.status(200).json({ status: "success", data: printOrder })
  }
)

export const deleteOrderPrint = deleteOne(PrintOrderModel)
export const getAllUserOrderPrint = getAll(PrintOrderModel)
export const getOneOrderPrint = getOne(PrintOrderModel)
export const updateOrderPrintStatus = updateOne(PrintOrderModel)
