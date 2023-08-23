import { Request, Response, NextFunction } from "express"
import Product from "../models/product.model"
import catchAsync from "../utils/catchAsync"
import AppError from "../utils/AppError"
import APIFeatures from "../utils/apiFeatures"
import { deleteOne, updateOne } from "./factory.controller"

export const createProduct = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const product = await Product.create(req.body)
  res.status(201).json({
    status: "success",
    data: product,
  })
})

export const getAllProduct = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const products = await features.query
  res
    .status(200)
    .json({ status: "success", length: products.length, data: products })
})

export const getProduct = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id
  const product = await Product.findById(id).populate("reviews")
  if (!product) {
    return next(new AppError(404, "There are no product with this id!"))
  }
  res.status(200).json({ status: "success", data: product })
})

export const updateProduct = updateOne(Product)

export const deleteProduct = deleteOne(Product)
