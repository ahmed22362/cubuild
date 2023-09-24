import mongoose from "mongoose"
import { CustomOrderStatus } from "./printCart.model"

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  quantity: number
}
export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId
  totalCost: number
  status: string
  shippingPrice: number
  shipping: boolean
  paymobOrderId: string
}
export interface IOnlineOrder extends IOrder {
  items: IOrderItem[]
}

export const baseOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: "true" },
  totalCost: { type: Number, required: true },
  shipping: { type: Boolean, default: true },
  shippingPrice: { type: Number, default: 35 },
  paymobOrderId: { type: String },
  status: {
    type: String,
    enum: Object.values(CustomOrderStatus),
    required: true,
    default: CustomOrderStatus.Pending,
  },
})

const OnlineOrderSchema = new mongoose.Schema<IOnlineOrder>({
  ...baseOrderSchema.obj,
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
})

const OrderModel = mongoose.model<IOrder>("Order", OnlineOrderSchema)
export default OrderModel
