import { Router } from "express"
import {
  getFileCartItem,
  getUserFileCart,
  userUpdateFileCartItem,
  uploadUserFile,
  adminUpdateFileCart,
} from "../controllers/fileCart.controller"
import { memoryMulter } from "../middleware/multer.cloudinary"
import { uploadToB2 } from "../middleware/uploadB2"
import { protect, restrictTo } from "../controllers/auth.controller"
import validate from "../middleware/validateSchema"
import {
  createFileCartSchema,
  getFileCartSchema,
} from "../schema/fileCart.schema"
import { setProductORUserIds } from "../controllers/review.controller"

const FileCartRouter = Router()

const upload = memoryMulter
FileCartRouter.route("/")
  .post(
    protect,
    upload.any(),
    setProductORUserIds,
    validate(createFileCartSchema),
    uploadToB2,
    uploadUserFile
  )
  .get(
    protect,
    setProductORUserIds,
    validate(getFileCartSchema),
    getUserFileCart
  )
FileCartRouter.route("/:fileCartId")
  .get(protect, setProductORUserIds, getFileCartItem)
  .patch(protect, userUpdateFileCartItem)
FileCartRouter.route(":fileCartId/admin").patch(
  protect,
  restrictTo("admin"),
  setProductORUserIds,
  adminUpdateFileCart
)
export default FileCartRouter
