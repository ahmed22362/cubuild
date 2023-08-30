import Product from "../models/product.model"
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factory.controller"

export const createProduct = createOne(Product)
export const getAllProduct = getAll(Product)

export const getProduct = getOne(Product, "reviews")
export const updateProduct = updateOne(Product)
export const deleteProduct = deleteOne(Product)
