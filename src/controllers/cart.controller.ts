import { NextFunction, Response, Request } from "express"
import Cart, { ICart, ICartItem } from "../models/cart.model"
import catchAsync from "../utils/catchAsync"
import mongoose from "mongoose"
import AppError from "../utils/AppError"
import logger from "../utils/logger"

export const getCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const cart = await findCartOrCreate(req.body.user)
    res.status(200).json({ status: "success", data: cart })
  }
)
export const addItemToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { product, quantity, user } = req.body
    const cart = await findCartOrCreate(user)
    const item = {
      _id: new mongoose.Types.ObjectId(),
      product,
      quantity: quantity,
    }
    const existingItem: ICartItem | undefined = cart.items.find((item) =>
      item.product.equals(product)
    )

    if (existingItem) {
      // Increment quantity of existing item
      existingItem.quantity++
    } else {
      // Product doesn't exist, push new item
      cart.items.push(item)
    }
    await saveCartAndPopulate(res, cart)
  }
)

export const UpdateItemFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body
    const { itemId } = req.params
    const cart = await findCartOrCreate(req.body.user)
    const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId))
    if (itemIndex <= -1) {
      res
        .status(404)
        .json({ status: "fail", message: "can't find item with this id " })
    }
    if (quantity * 1 == 0) {
      return next(
        new AppError(
          400,
          "You can't update the quantity to 0! please use remove item instead"
        )
      )
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity

    await saveCartAndPopulate(res, cart)
  }
)

export const deleteItemFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params
    // manual way to delete the item
    // const cart = await findCartOrCreate(req.body.user)
    // // Find index of item with matching productId
    // const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId))

    // // Check if item was found
    // if (itemIndex == -1) {
    //   return next(new AppError(400, "can't find item with this id "))
    // }
    // // Remove item from array
    // cart.items.splice(itemIndex, 1)

    // Remove file from document using $pull features from mongoDB
    const cart = await findCartOrCreate(req.body.user)
    const updatedCart = (await Cart.findByIdAndUpdate(
      { _id: cart.id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    )) as ICart

    await saveCartAndPopulate(res, updatedCart)
  }
)

export const deleteAllItemsFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await findCartOrCreate(req.body.user)
    cart.items = []
    await cart.save()
    res.status(200).json({
      status: "success",
      data: cart,
      message: "all items deleted successfully",
    })
  }
)
const saveCartAndPopulate = async (res: Response, cart: ICart) => {
  // Save cart
  await cart.save()

  await cart.populate({
    path: "items.product",
    select: "title price images",
  })
  res.status(200).json({ status: "success", data: cart })
}
const findCartOrCreate = async (userID: string) => {
  try {
    let cart = await Cart.findOne({ user: userID })
    //   .populate("items.product")
    if (!cart) {
      cart = await Cart.create({
        user: userID,
        items: [],
      })
    }
    return cart
  } catch (error: any) {
    logger.error(error)
    throw new AppError(
      400,
      `Some Thing wrong happened while creating or getting the cart: ${error.message}`
    )
  }
}
