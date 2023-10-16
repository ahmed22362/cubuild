import { NextFunction, Response, Request } from "express"
import catchAsync from "../utils/catchAsync"
import { IRequestWithUser } from "./auth.controller"
import dotenv from "dotenv"
import PrintCartModel, {
  IPrintCart,
  CustomOrderStatus,
} from "../models/printCart.model"
import B2Client from "../utils/b2client"
import AppError from "../utils/AppError"
dotenv.config()

export const uploadUserFile = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { options, description } = req.body
    console.log(res.locals)
    const files = res.locals.fileData.map((file: any) => {
      return {
        fileName: file.fileName,
        b2FileUrl: file.fileUrl,
        b2FileId: file.fileId,
      }
    })
    const printCartItem = await PrintCartModel.create({
      user: req.user?.id,
      files: files,
      options,
      description,
    })
    res.status(200).json({
      status: "success",
      data: printCartItem,
      message: "uploaded successfully",
    })
  }
)
export const getUserPrintCart = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const printCart = await PrintCartModel.find({ user: req.body.user })
    if (!printCart) {
      return next(
        new AppError(400, "something wrong while getting custom orders")
      )
    }
    res
      .status(200)
      .json({ status: "success", length: printCart.length, data: printCart })
  }
)

export const getPrintCartItem = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { PrintCartItemId } = req.params
    const printCartItem = await PrintCartModel.findOne({
      _id: PrintCartItemId,
      user: req.body.user,
    })
    if (!printCartItem) {
      return next(new AppError(400, "Can''t find item with this id!"))
    }
    res.status(200).json({ status: "success", data: printCartItem })
  }
)

export const userUpdatePrintCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { PrintCartItemId } = req.params
    const { options, user } = req.body
    const PrintCartItem = await PrintCartModel.findOne({
      _id: PrintCartItemId,
      user: user,
    })
    if (!PrintCartItem) {
      return next(
        new AppError(400, "Can't find item in the cart with this id!")
      )
    }
    if (PrintCartItem.status !== CustomOrderStatus.Pending) {
      return next(
        new AppError(
          400,
          "can't update the item with status rather than pending!"
        )
      )
    }
    PrintCartItem.options = options
    await PrintCartItem.save()
    res.status(200).json({ status: "success", data: PrintCartItem })
  }
)

export const deleteFileFromPrintCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { PrintCartItemId } = req.params
    const { fileName, b2FileId, user } = req.body
    const keyId = process.env.B2_KEY_ID as string
    const applicationKey = process.env.B2_APPLICATION_KEY as string
    const updatedPrintCart = (await PrintCartModel.findByIdAndUpdate(
      { _id: PrintCartItemId, user: user },
      { $pull: { files: { b2FileId: b2FileId } } },
      { new: true }
    )) as IPrintCart
    if (!updatedPrintCart) {
      return next(new AppError(400, "Can't find cart with this id"))
    }
    const b2client = new B2Client(keyId, applicationKey)
    await b2client.deleteFile(b2FileId, fileName)

    if (updatedPrintCart.files.length === 0) {
      await PrintCartModel.deleteOne({ _id: PrintCartItemId })
      return res.status(200).json({
        status: "success",
        message:
          "file removed successfully and the whole document removed because there are no files now!",
      })
    }
    res.status(200).json({
      status: "success",
      message: "file removed successfully",
      data: updatedPrintCart,
    })
  }
)
export const addFilesToPrintCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { PrintCartItemId } = req.params
    const { user } = req.body
    const files = res.locals.fileData.map((file: any) => {
      return {
        fileName: file.fileName,
        b2FileUrl: file.fileUrl,
        b2FileId: file.fileId,
      }
    })

    const fileCart = await PrintCartModel.findOne({
      _id: PrintCartItemId,
      user: user,
    })
    if (!fileCart) {
      return next(new AppError(400, "Can't find file cart item with this id"))
    }
    // concat return new array concatenated the two arrays
    fileCart.files = fileCart.files.concat(files)
    await fileCart.save()
    res.status(200).json({
      status: "success",
      message: "file removed successfully",
      data: fileCart,
    })
  }
)

export const adminUpdatePrintCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { PrintCartItemId } = req.params
    const { status, price } = req.body
    const updatedPrintCart = await PrintCartModel.findOneAndUpdate(
      { _id: PrintCartItemId },
      {
        status: status,
        price: price,
      },
      { new: true }
    )
    if (!updatedPrintCart) {
      return next(new AppError(400, "Can't find item with this id!"))
    }
    res.status(200).json({ status: "success", data: updatedPrintCart })
  }
)
