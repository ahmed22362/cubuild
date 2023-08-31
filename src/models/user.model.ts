import mongoose from "mongoose"
import bcrypt from "bcrypt"
import logger from "../utils/logger"
import crypto from "crypto"
import { sendWelcomeUser } from "../utils/sendmail"
import dotenv from "dotenv"
import convert from "../utils/convertEnvStrToNum"
dotenv.config()

export interface Address extends mongoose.Document {
  street: string
  city: string
  country: string
  location: {
    type: "Point"
    coordinates: [number, number] // long, lat
  }
}

export interface IUserInput {
  name: string
  email: string
  password: string
  address: Address
}

export interface IUserResponse {
  name: string
  email: string
  address: Address
  _id: string
  password: string | undefined
  role: string | undefined
}
export interface IUserDocument extends IUserInput, mongoose.Document {
  createdAt: Date
  UpdatedAt: Date
  passwordChangedAt: number
  role: string
  passwordResetToken: string | undefined
  passwordResetTokenExpires: number | undefined
  comparePassword(
    candidatePassword: string,
    userHashedPassword: string
  ): Promise<Boolean>
  isPasswordChangedAfter(JWTTimestamp: number): boolean
  generatePasswordResetToken(): string
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    address: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "point",
        },
        coordinates: {
          type: [Number], // long , lat
        },
      },
    },
    passwordChangedAt: Number,
    passwordResetToken: String,
    passwordResetTokenExpires: Number,
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
userSchema.pre("save", async function (next) {
  let user = this as IUserDocument
  if (!user.isModified("password")) {
    return next()
  }
  const saltWork: number | undefined = convert(process.env.saltWorkFactor)
  //config.get<number>("saltWorkFactor")
  // use random salt use UUID TODO
  const salt = await bcrypt.genSalt(saltWork)
  const hash = await bcrypt.hash(user.password.toString(), salt)
  user.password = hash
  return next()
})
userSchema.pre("save", async function (next) {
  const user = this as IUserDocument
  if (!user.isModified("password") || user.isNew) {
    return next()
  }
  // subtract one sec from this time so the it always before the token we issued after this is assigned
  user.passwordChangedAt = Date.now() - 1000
  next()
})
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userHashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(candidatePassword, userHashedPassword)
    return match
  } catch (error) {
    return false
  }
}

userSchema.methods.isPasswordChangedAfter = function (
  JWTTimestamp: number
): boolean {
  let user = this as IUserDocument

  if (user.passwordChangedAt) {
    // getTime return in mill sec and the timestamp is in sec
    const changedTimestamp = Math.floor(user.passwordChangedAt / 1000)

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}
userSchema.methods.generatePasswordResetToken = function () {
  let user = this as IUserDocument
  const resetToken = crypto.randomBytes(32).toString("hex")
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  user.passwordResetTokenExpires = Date.now() * 60 * 60 * 1000 // one hour
  return resetToken
}
userSchema.post("save", async function () {
  let user = this as IUserDocument
  if (user.isNew) await sendWelcomeUser(user.name, user.email)
})
const User = mongoose.model<IUserDocument>("User", userSchema)

export default User
