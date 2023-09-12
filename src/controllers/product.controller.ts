import { NextFunction, Request, Response } from "express"
import Product from "../models/product.model"
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factory.controller"

export const aliasTopProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  // req.query.fields = "title,price,ratingsAverage,coverImage,tags"
  next()
}

export const createProduct = createOne(Product)
// undefined is the populationOptions
export const getAllProduct = getAll(
  Product,
  undefined,
  "title description coverImage price tags"
)

export const getProduct = getOne(Product, {
  path: "reviews",
})
export const updateProduct = updateOne(Product)
export const deleteProduct = deleteOne(Product)
