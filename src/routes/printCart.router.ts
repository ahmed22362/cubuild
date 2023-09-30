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
  addFileToPrintCartSchema,
  adminUpdatePrintCartSchema,
  createPrintCartSchema,
  deleteFileFromPrintCartSchema,
  getPrintCarItemSchema,
  getPrintCartSchema,
  updatePrintCartItemOptionsSchema,
} from "../schema/printCart.schema"
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
    validate(createPrintCartSchema),
    uploadToB2,
    uploadUserFile
  )
  .get(
    protect,
    setProductORUserIds,
    validate(getPrintCartSchema),
    getUserPrintCart
  )
PrintCartRouter.route("/:PrintCartItemId")
  .get(
    protect,
    setProductORUserIds,
    validate(getPrintCarItemSchema),
    getPrintCartItem
  )
  .patch(
    protect,
    setProductORUserIds,
    validate(updatePrintCartItemOptionsSchema),
    userUpdatePrintCartItem
  )

PrintCartRouter.route("/:PrintCartItemId/file")
  .post(
    upload.any(),
    protect,
    setProductORUserIds,
    uploadToB2,
    validate(addFileToPrintCartSchema),
    addFilesToPrintCartItem
  )
  .patch(
    protect,
    setProductORUserIds,
    validate(deleteFileFromPrintCartSchema),
    deleteFileFromPrintCart
  )

PrintCartRouter.route("/:PrintCartItemId/admin").patch(
  protect,
  restrictTo("admin"),
  validate(adminUpdatePrintCartSchema),
  adminUpdatePrintCart
)
export default PrintCartRouter
