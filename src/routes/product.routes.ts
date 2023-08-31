import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/product.controller"
import validate from "../middleware/validateSchema"
import {
  getProductSchema,
  updateProductSchema,
  createProductSchema,
  deleteProductSchema,
} from "../schema/product.schema"
import { protect, restrictTo } from "../controllers/auth.controller"
import ReviewRouter from "./review.routes"
import cartRouter from "./cart.routes"

const productRouter = Router()

//nest route with reviews
productRouter.use("/:productId/reviews", ReviewRouter)
//nest route with cart
productRouter.use("/:productId/cart", cartRouter)

productRouter
  .route("/")
  .get(getAllProduct)
  .post(validate(createProductSchema), createProduct)
productRouter
  .route("/:id")
  .patch(validate(updateProductSchema), updateProduct)
  .get(validate(getProductSchema), getProduct)
  .delete(
    protect,
    restrictTo("admin"),
    validate(deleteProductSchema),
    deleteProduct
  )

export default productRouter
