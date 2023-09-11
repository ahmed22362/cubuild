import { NextFunction, Response, Request } from "express"
import catchAsync from "../utils/catchAsync"
import { IRequestWithUser } from "./auth.controller"
import dotenv from "dotenv"
import FileCartModel, {
  IFileCart,
  CustomOrderStatus,
} from "../models/fileCart.model"
import B2Client from "../utils/b2client"
import AppError from "../utils/AppError"
dotenv.config()

export const uploadUserFile = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { options, description } = req.body
    const files = res.locals.fileData.map((file: any) => {
      return {
        fileName: file.fileName,
        b2FileUrl: file.fileUrl,
        b2FileId: file.fileId,
      }
    })
    const fileCartItem = await FileCartModel.create({
      user: req.user?.id,
      files: files,
      options,
      description,
    })
    res.status(200).json({
      status: "success",
      data: fileCartItem,
      message: "updated successfully",
    })
  }
)
export const getUserFileCart = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const fileCart = await FileCartModel.find({ user: req.body.user })
    if (!fileCart) {
      return next(
        new AppError(400, "something wrong while getting custom orders")
      )
    }
    res
      .status(200)
      .json({ status: "success", length: fileCart.length, data: fileCart })
  }
)

export const getFileCartItem = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { FileCartItemId } = req.params
    console.log(req.body, req.params)
    const fileCartItem = await FileCartModel.findOne({
      _id: FileCartItemId,
      user: req.body.user,
    })
    if (!fileCartItem) {
      return next(new AppError(400, "Can''t find item with this id!"))
    }
    res.status(200).json({ status: "success", data: fileCartItem })
  }
)

export const userUpdateFileCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { FileCartItemId } = req.params
    const { options, user } = req.body
    console.log(user, FileCartItemId)
    const FileCartItem = await FileCartModel.findOne({
      _id: FileCartItemId,
      user: user,
    })
    if (!FileCartItem) {
      return next(
        new AppError(400, "Can't find item in the cart with this id!")
      )
    }
    if (FileCartItem.status !== CustomOrderStatus.Pending) {
      return next(
        new AppError(
          400,
          "can't update the item with status rather than pending!"
        )
      )
    }
    FileCartItem.options = options
    await FileCartItem.save()
    res.status(200).json({ status: "success", data: FileCartItem })
  }
)

export const deleteFileFromFileCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { FileCartItemId } = req.params
    const { fileName, b2FileId, user } = req.body
    const keyId = process.env.B2_KEY_ID || ""
    const applicationKey = process.env.B2_APPLICATION_KEY || ""
    const b2client = new B2Client(keyId, applicationKey)
    console.log(fileName, b2FileId, user)
    // await b2client.deleteFile(b2FileId, fileName)

    const updatedFileCart = (await FileCartModel.findByIdAndUpdate(
      { _id: FileCartItemId, user: user },
      { $pull: { files: { b2FileId: b2FileId } } },
      { new: true }
    )) as IFileCart
    if (updatedFileCart.files.length === 0) {
      await FileCartModel.deleteOne({ _id: FileCartItemId })
      return res
        .status(200)
        .json({
          status: "success",
          message:
            "file removed successfully and the whole document removed because there are no files now!",
        })
    }
    res.status(200).json({
      status: "success",
      message: "file removed successfully",
      data: updatedFileCart,
    })
  }
)
export const addFilesToFileCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { FileCartItemId } = req.params
    const { user } = req.body
    const files = res.locals.fileData.map((file: any) => {
      return {
        fileName: file.fileName,
        b2FileUrl: file.fileUrl,
        b2FileId: file.fileId,
      }
    })

    const fileCart = await FileCartModel.findOne({
      _id: FileCartItemId,
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

export const adminUpdateFileCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { FileCartItemId } = req.params
    const { user, status } = req.body
    const updatedFileCart = await FileCartModel.findOneAndUpdate(
      { _id: FileCartItemId, user: user },
      {
        status: status,
      },
      { new: true }
    )
    res.status(200).json({ status: "success", data: updatedFileCart })
  }
)
