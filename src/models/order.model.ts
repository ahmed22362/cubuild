import mongoose from "mongoose"

enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
  Canceled = "canceled",
}

interface IOrderItem {
  product: mongoose.Types.ObjectId
  quantity: number
}
interface IOrder extends mongoose.Document {
  user?: mongoose.Types.ObjectId
  items?: IOrderItem[]
  totalCost: number
  status: string
}

const orderSchema = new mongoose.Schema<IOrder>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: "true" },
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
  totalCost: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.Pending,
  },
})

const OrderModel = mongoose.model<IOrder>("Order", orderSchema)
export default OrderModel
