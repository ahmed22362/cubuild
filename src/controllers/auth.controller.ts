import { Request, Response, NextFunction } from "express"
import catchAsync from "../utils/catchAsync"
import User, {
  IUserDocument,
  IUserInput,
  IUserResponse,
} from "../models/user.model"
import { LoginUserSchemaBody } from "../schema/user.schema"
import AppError from "../utils/AppError"
import { singJWTToken, verifyToken } from "../utils/jwt"
import Mail from "../utils/sendmail"
import crypto from "crypto"
import dotenv from "dotenv"
import logger from "../utils/logger"
import {
  getGoogleOAuthTokens,
  getGoogleUser,
} from "../services/googleOauth.service"
import { create } from "domain"
dotenv.config()

export interface IRequestWithUser extends Request {
  user?: IUserDocument
}
interface decodedToken {
  id: string
  iat: number
  exp: number
}

const createSendToken = ({
  user,
  statusCode,
  res,
  redirect,
}: {
  user: IUserResponse
  statusCode?: number
  res: Response
  redirect?: string
}) => {
  const token: string = singJWTToken({ id: user._id })
  const millSecToDay: number = 24 * 60 * 60 * 1000
  // const cookieExpire = config.get<number>("JWT_COOKIES_EXPIRES")
  const cookieExpire = process.env.JWT_COOKIES_EXPIRES as any
  let cookieOptions = {
    expires: new Date(Date.now() + cookieExpire * millSecToDay),
    httpOnly: true,
    secure: false,
  }

  // local host is not https so for test purpose we will make this if statement
  if (process.env.NODE_ENV?.trim() === "production") {
    cookieOptions.secure = true
  }
  console.log(cookieOptions)
  // remove the password from the user data to not send it in the response
  user.password = undefined
  user.role = undefined
  // set cookies
  res.cookie("token", token, cookieOptions)
  if (statusCode) {
    return res.status(statusCode).json({ status: "success", token, data: user })
  } else if (redirect) {
    return res.redirect(redirect)
  }

  res.status(200).json({ status: "success", token, data: user })
}

export const signup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, address, billing, phoneNumber }: IUserInput =
    req.body

  const userData: IUserInput = {
    name,
    email,
    password,
    address,
    billing,
    phoneNumber,
  }
  const newUser: IUserResponse = await User.create(userData)
  createSendToken({ user: newUser, statusCode: 201, res })
})

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  res.send(singJWTToken({ test: "test" }))
}

export const login = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the data first
  const { email, password }: LoginUserSchemaBody = req.body
  // Find if the user exist
  const user = await User.findOne({ email: email }).select("+password")
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(401, "There email or password is not correct!"))
  }

  createSendToken({ user, statusCode: 202, res })
})

export const protect = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token: string | undefined
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      logger.info(`yes in cookies`)
      token = req.cookies.token
    }
    if (!token) {
      return next(
        new AppError(401, "You are not logged in! Please log in to get access.")
      )
    }
    // 2) Verification token
    const decoded = (await verifyToken(token)) as decodedToken

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      return next(
        new AppError(
          401,
          "The user belonging to this token does no longer exist."
        )
      )
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.isPasswordChangedAfter(decoded.iat)) {
      return next(
        new AppError(
          401,
          "User recently changed password! Please log in again."
        )
      )
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next()
  }
)

export const restrictTo = (...roles: string[]) => {
  return (req: IRequestWithUser, res: Response, next: NextFunction) => {
    roles.flat(Infinity)
    if (!roles.includes(req.user!.role)) {
      return next(new AppError(403, "You don't have permission to do this!"))
    }
    next()
  }
}

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return next(new AppError(404, "Can't find user with this email!"))
    }
    const resetToken: string = user.generatePasswordResetToken()
    await user.save() // saved the hashed token in the user document
    //send the mail
    const resetURL: string = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/auth/resetPassword/${resetToken}`
    try {
      const mail = new Mail(user.email, user.name, resetURL)
      await mail.sendForgetPassword()
      res.status(200).json({ status: "success", message: "token sent to mail" })
    } catch (e) {
      user.passwordResetToken = undefined
      user.passwordResetTokenExpires = undefined
      await user.save()
      return next(
        new AppError(
          500,
          "There are error while sending the mail. Try again later!"
        )
      )
    }
  }
)

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password, passwordConfirmation } = req.body
    const hashedToken: string = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    })
    if (!user) {
      return res.render("resetPasswordError", { error: "Link is not valid!" })
    }
    if (user.passwordResetToken !== hashedToken) {
      return res.render("resetPasswordError", { error: "Link is not valid!" })
    }
    // Validate the new password and confirmation
    if (password !== passwordConfirmation) {
      return next(new AppError(400, "Passwords do not match!"))
    }
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    await user.save()
    // createSendToken(user, 200, res)
    // Set a success message
    // Redirect to the login page
    res.render("resetPasswordSuccess")
  }
)

export const updatePassword = catchAsync(
  async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user!._id).select("+password")
    if (!user) {
      return next(
        new AppError(
          400,
          "some thing wend wrong while getting the user in update password"
        )
      )
    }
    if (
      !(await user.comparePassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError(400, "Your current password is wrong"))
    }
    // 3) If so, update password
    user.password = req.body.currentPassword
    await user.save()
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken({ user, statusCode: 200, res })
  }
)

export const googleOauthController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the code from qs
    const code = req.query.code as string
    // get the id and access token with the code
    try {
      const { id_token, access_token } = await getGoogleOAuthTokens({
        code,
      })
      // get user with tokens
      const googleUser = await getGoogleUser({ id_token, access_token })
      //jwt.decode(id_token);
      // upsert the user
      if (!googleUser.verified_email) {
        throw new AppError(403, "Google Account is not verified!")
      }
      const user = await User.findOneAndUpdate(
        { email: googleUser.email },
        {
          email: googleUser.email,
          name: googleUser.name,
        },
        {
          upsert: true,
          new: true,
        }
      )
      logger.info({ user })
      // create an access token
      createSendToken({ user, redirect: "https://cubuild.net/", res })
    } catch (error: any) {
      logger.error(error, "Failed to authorized Google user!")
      return res.render("errorPage", { message: error.message })
    }
  }
)
