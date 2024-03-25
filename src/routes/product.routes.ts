import { Router, Request, Response, NextFunction } from "express";
import {
  aliasTopProducts,
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import validate from "../middleware/validateSchema";
import {
  getProductSchema,
  updateProductSchema,
  createProductSchema,
  deleteProductSchema,
} from "../schema/product.schema";
import { protect, restrictTo } from "../controllers/auth.controller";
import ReviewRouter from "./review.routes";
import cartRouter from "./cart.routes";
import parser from "../middleware/multer.cloudinary";

interface Files {
  images: Express.Multer.File[];
  coverImage: Express.Multer.File[];
}

const productRouter = Router();

const setImagesUrlToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files) {
    // return next(new AppError(400, "Please provide files to upload"))
    return next();
  }
  const files = req.files as unknown as Files;
  if (files?.coverImage) req.body.coverImage = files.coverImage[0].path;
  if (files?.images) {
    req.body.images = files.images.map((file) => file.path);
  }
  // convert it to number because form-data in postman send it as string
  if (req.body.price) req.body.price = req.body.price * 1;
  next();
};
const uploadMultiple = parser.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  { name: "images", maxCount: 4 },
]);

//nest route with reviews
productRouter.use("/:productId/reviews", ReviewRouter);
//nest route with cart
productRouter.use("/:productId/cart", cartRouter);

productRouter
  .route("/")
  .get(getAllProduct)
  .post(
    uploadMultiple,
    setImagesUrlToBody,
    validate(createProductSchema),
    createProduct,
  );
productRouter.get("/recommendation", aliasTopProducts, getAllProduct);

productRouter
  .route("/:id")
  .patch(
    uploadMultiple,
    setImagesUrlToBody,
    validate(updateProductSchema),
    protect,
    restrictTo("admin"),
    updateProduct,
  )
  .get(validate(getProductSchema), getProduct)
  .delete(
    protect,
    restrictTo("admin"),
    validate(deleteProductSchema),
    deleteProduct,
  );

export default productRouter;
