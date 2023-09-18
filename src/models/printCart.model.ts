import mongoose from "mongoose"

export enum CustomOrderStatus {
  Pending = "pending",
  Processing = "processing ",
  Shipped = "shipped",
  Delivered = "delivered",
  Completed = "completed",
  Not_Valid = "not valid",
}

export interface IFileItem {
  fileName: string
  b2FileUrl: string
  b2FileId: string
}
export interface IPrintCart {
  user: mongoose.Types.ObjectId
  files: IFileItem[]
  options?: {
    name: string
    values: string[]
  }[]
  description?: string
  status: string
  price: number
}

const PrintCartModelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    files: [
      {
        fileName: {
          type: String,
          require: [true, "please provide name for the file "],
        },
        b2FileUrl: {
          type: String,
          require: [true, "please provide url for the file"],
        },
        b2FileId: {
          type: String,
          require: [true, "please provide B2 Id for the file"],
        },
      },
    ],
    options: [{ name: { type: String }, values: [{ type: String }] }],
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(CustomOrderStatus),
      required: true,
      default: CustomOrderStatus.Pending,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

const PrintCartModel = mongoose.model<IPrintCart>(
  "PrintCart",
  PrintCartModelSchema
)

export default PrintCartModel
