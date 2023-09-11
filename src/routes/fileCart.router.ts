import { Router } from "express"
import {
  getFileCartItem,
  getUserFileCart,
  userUpdateFileCartItem,
  uploadUserFile,
  adminUpdateFileCart,
  addFilesToFileCartItem,
  deleteFileFromFileCart,
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

// Not working i do'nt know why!
// FileCartRouter.use(protect, setProductORUserIds)
FileCartRouter.route("/")
  .post(
    upload.any(),
    protect,
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
FileCartRouter.route("/:FileCartItemId")
  .get(protect, setProductORUserIds, getFileCartItem)
  .patch(protect, setProductORUserIds, userUpdateFileCartItem)

FileCartRouter.route("/:FileCartItemId/file")
  .post(
    upload.any(),
    protect,
    setProductORUserIds,
    uploadToB2,
    addFilesToFileCartItem
  )
  .patch(protect, setProductORUserIds, deleteFileFromFileCart)

FileCartRouter.route(":FileCartItemId/admin").patch(
  protect,
  setProductORUserIds,
  restrictTo("admin"),
  adminUpdateFileCart
)
export default FileCartRouter
