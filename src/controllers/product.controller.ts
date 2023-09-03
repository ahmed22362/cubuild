import Product from "../models/product.model"
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factory.controller"

export const createProduct = createOne(Product)
// undefined is the populationOptions
export const getAllProduct = getAll(
  Product,
  undefined,
  "title description coverImage price"
)

export const getProduct = getOne(Product, {
  path: "reviews",
})
export const updateProduct = updateOne(Product)
export const deleteProduct = deleteOne(Product)
