import { Request, NextFunction, Response } from "express"
import catchAsync from "../utils/catchAsync"
import Order from "../models/order.model"
import { IRequestWithUser } from "./auth.controller"
import Cart, { ICart } from "../models/cart.model"
import Product from "../models/product.model"
import AppError from "../utils/AppError"
import { deleteOne, getAll, getOne } from "./factory.controller"
import Paymob from "../payments/paymobStrategy"
import dotenv from "dotenv"
dotenv.config()

const API_TOKEN = process.env.PAYMOB_API as string

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, shipping, shippingPrice } = req.body
    // remove shippingPrice make it automated
    const cart = await Cart.findOne({ user: user }).populate({
      path: "items.product",
      select: "title price description quantity",
    })
    if (!cart) {
      return next(new AppError(400, "Can't find cart for this user"))
    }
    if (cart.items.length === 0) {
      return next(new AppError(400, "There is no items to make order with!"))
    }
    // check if there is order document first or not
    // if there is order document i want to add the content of the cart to it
    // not to overwrite it!
    const total = ((await calculateTotal(cart)) +
      (shipping ? shippingPrice : 0)) as number
    try {
      const paymobItems = cart.items.map((item: any) => {
        return {
          name: item.product.title,
          amount_cents: (item.quantity * item.product.price * 100).toString(),
          description: item.product.description || "",
          quantity: item.quantity.toString(),
        }
      })
      const paymobOrderId = await new Paymob(API_TOKEN).registerOrder(
        paymobItems,
        total
      )
      const order = await Order.create({
        user: user,
        shipping,
        shippingPrice,
        paymobOrderId,
        items: cart.items,
        totalCost: total,
      })
      if (!order) {
        return next(
          new AppError(400, "There is problem while creating the order!")
        )
      }
      // Empty the cart after adding them to order
      cart.items = []

      //save the changes to database
      await cart.save()

      // populate products before it send
      await order.populate({
        path: "items.product",
        select: "title price coverImage",
      })
      res.status(200).json({ status: "success", data: order })
    } catch (error: any) {
      res.status(400).json({ status: "fail", message: error.message })
    }
  }
)

export const getAllUserOrders = getAll(Order, {
  path: "items.product",
  select: "title price coverImage",
})
export const getOrder = getOne(Order, {
  path: "items.product",
  select: "title price coverImage",
})

export const deleteOrder = deleteOne(Order)

// Utility function to calculate order total
const calculateTotal = async function (cart: ICart) {
  let total = 0

  for (let item of cart.items) {
    // Get product price from database
    const product = await Product.findById(item.product)
    if (!product) {
      return new AppError(
        400,
        "Can't find this product with the id in calculate total price"
      )
    }
    total += product.price * item.quantity
  }

  return total
}
