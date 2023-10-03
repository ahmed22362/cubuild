import mongoose from "mongoose"
import bcrypt from "bcrypt"
import logger from "../utils/logger"
import crypto from "crypto"
import Mail from "../utils/sendmail"
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

interface IBillingData extends mongoose.Document {
  apartment: string
  email: string
  floor: string
  first_name: string
  street: string
  building: string
  phone_number: string
  shipping_method: string
  postalCode: string
  city: string
  country: string
  last_name: string
  state: string
}

export interface IUserInput {
  name: string
  email: string
  password: string
  phoneNumber: string
  address: Address
  billing: IBillingData
}

export interface IUserResponse {
  name: string
  email: string
  address: Address
  phoneNumber: string
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
    phoneNumber: {
      type: String,
    },
    billing: {
      first_name: { type: String, required: true, default: "NA" },
      last_name: { type: String, required: true, default: "NA" },
      email: { type: String, required: true, default: "NA" },
      phone_number: { type: String, required: true, default: "NA" },
      floor: { type: String, required: true, default: "NA" },
      apartment: { type: String, required: true, default: "NA" },
      street: { type: String, required: true, default: "NA" },
      building: { type: String, required: true, default: "NA" },
      city: { type: String, required: true, default: "NA" },
      country: { type: String, required: true, default: "NA" },
      state: { type: String, required: true, default: "NA" },
      postal_code: { type: String, required: true, default: "NA" },
      shipping_method: { type: String, default: "PKG" },
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
          default: "Point",
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

function updateBillingData(user: IUserDocument) {
  const checkAvailable = (item: string) => {
    return item && item !== "NA"
  }
  // Billing firstName
  if (!checkAvailable(user.billing.first_name)) {
    user.billing.first_name = user.name
  }

  // Billing lastName
  if (!checkAvailable(user.billing.last_name)) {
    // Split name on space to get last name
    const nameParts = user.name.split(" ")
    user.billing.last_name = nameParts[nameParts.length - 1]
  }

  // Billing email
  if (!checkAvailable(user.billing.email)) {
    user.billing.email = user.email
  }
  // Billing phone
  if (!checkAvailable(user.billing.phone_number)) {
    user.billing.phone_number = user.phoneNumber
  }
}

userSchema.pre("save", function (next) {
  updateBillingData(this)
  return next()
})

userSchema.pre("save", async function (next) {
  let user = this as IUserDocument
  if (!user.isModified("password")) {
    return next()
  }
  const saltWork: number | undefined = convert(process.env.saltWorkFactor)
  //config.get<number>("saltWorkFactor")
  // generate the salt round
  // Get random number between 0 (inclusive) and 1 (exclusive)
  Math.random()

  // Scale random number between min and max
  const min = 10
  const max = 13
  const random = Math.random() * (max - min) + min
  const salt = await bcrypt.genSalt(random)
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
  if (user.isNew) await new Mail(user.email, user.name).sendWelcome()
})
const User = mongoose.model<IUserDocument>("User", userSchema)

export default User
