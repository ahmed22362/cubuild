import { Request, Response, NextFunction } from "express"
import catchAsync from "../utils/catchAsync"
import User, { IUserInput } from "../models/user.model"
import logger from "../utils/logger"
import AppError from "../utils/AppError"
import { IRequestWithUser } from "./auth.controller"
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factory.controller"

export const getMe = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  req.params.id = req.user?.id
  next()
}

export const updateMe = updateOne(User)
export const createUser = createOne(User)
export const getAllUsers = getAll(User)
export const getUser = getOne(User)
export const updateUserById = updateOne(User)
export const deleteUserById = deleteOne(User)

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
