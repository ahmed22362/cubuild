import e, { Request, Response, NextFunction } from "express"
import catchAsync from "../utils/catchAsync"
import User, { IUserInput } from "../models/user.model"
import logger from "../utils/logger"
import AppError from "../utils/AppError"
import { IRequestWithUser } from "./auth.controller"

function filterBodyObj<T extends Record<string, any>>(
  obj: T,
  ...fields: Array<keyof T>
): Partial<T> {
  const newObj: Partial<T> = {}
  fields.forEach((el) => {
    if (obj.hasOwnProperty(el)) {
      newObj[el] = obj[el]
    }
  })
  return newObj
}

export const updateMe = catchAsync(async function (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.body.password) {
    return next(
      new AppError(
        400,
        "This route is not for updating password! use /updateMyPassword"
      )
    )
  }
  const filteredObj = filterBodyObj(req.body, "name", "email", "address")
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user?.id },
    filteredObj,
    {
      new: true,
    }
  )
  res.status(200).json({ status: "success", data: updatedUser })
})

export const createUser = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userInfo: IUserInput = req.body
  const newUser = await User.create(userInfo)
  res.status(201).json({ status: "success", data: newUser })
})

export const findAllUsers = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const users = await User.find()
  res.status(200).json({ status: "success", length: users.length, data: users })
})

export const findUser = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id
  const user = await User.findById(id).select("-password")
  if (!user) {
    return res
      .status(404)
      .json({ status: "fail", message: "There is no user with this id" })
  }
  res.status(200).json({ status: "success", data: user })
})
export const updateUserById = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id
  const user = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  })
  if (!user) {
    return res
      .status(400)
      .json({ status: "fail", message: "can't find user with this id" })
  }
  res.status(200).json({ status: "success", data: user })
})
export const deleteUserById = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id
  await User.findOneAndRemove({ _id: id })
  res
    .status(200)
    .json({ status: "success", message: "The document deleted successfully" })
})
export const deleteAllUsers = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  await User.deleteMany({})
  res.status(200).json({
    status: "success",
    message: "you successfully deleted all users! what we will do now",
  })
})
