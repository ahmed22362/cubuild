import { Router } from "express"
import {
  getPrintCartItem,
  getUserPrintCart,
  userUpdatePrintCartItem,
  uploadUserFile,
  adminUpdatePrintCart,
  addFilesToPrintCartItem,
  deleteFileFromPrintCart,
} from "../controllers/cartPrint.controller"
import { memoryMulter } from "../middleware/multer.cloudinary"
import { uploadToB2 } from "../middleware/uploadB2"
import { protect, restrictTo } from "../controllers/auth.controller"
import validate from "../middleware/validateSchema"
import {
  createFileCartSchema,
  getFileCartSchema,
} from "../schema/fileCart.schema"
import { setProductORUserIds } from "../controllers/review.controller"

const PrintCartRouter = Router()

const upload = memoryMulter

// Not working i do'nt know why!
// PrintCartRouter.use(protect, setProductORUserIds)
PrintCartRouter.route("/")
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
    getUserPrintCart
  )
PrintCartRouter.route("/:PrintCartItemId")
  .get(protect, setProductORUserIds, getPrintCartItem)
  .patch(protect, setProductORUserIds, userUpdatePrintCartItem)

PrintCartRouter.route("/:PrintCartItemId/file")
  .post(
    upload.any(),
    protect,
    setProductORUserIds,
    uploadToB2,
    addFilesToPrintCartItem
  )
  .patch(protect, setProductORUserIds, deleteFileFromPrintCart)

PrintCartRouter.route("/:PrintCartItemId/admin").patch(
  protect,
  restrictTo("admin"),
  adminUpdatePrintCart
)
export default PrintCartRouter
