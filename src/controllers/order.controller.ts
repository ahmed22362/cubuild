import { NextFunction, Response } from "express"
import catchAsync from "../utils/catchAsync"
import Order from "../models/order.model"
import { IRequestWithUser } from "./auth.controller"
import Cart, { ICart } from "../models/cart.model"
import Product from "../models/product.model"
import AppError from "../utils/AppError"
import { getAll, getOne } from "./factory.controller"

export const createOrder = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.body.user })
    if (!cart) {
      return res
        .status(400)
        .json({ status: "fail", message: "Can't find cart for this user" })
    }
    // check if there is order document first or not
    // if there is order document i want to add the content of the cart to it
    // not to overwrite it!
    const total: number | AppError = await calculateTotal(cart)
    const order = await Order.create({
      user: req.body.user,
      items: cart.items,
      totalCost: total,
    })
    if (!order) {
      return res.status(400).json({
        status: "fail",
        message: "There is problem while creating the order!",
      })
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
