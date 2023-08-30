import mongoose from "mongoose"

interface ICartItem {
  product: mongoose.Types.ObjectId
  quantity: number
}
interface ICart extends mongoose.Document {
  user?: mongoose.Types.ObjectId
  items: ICartItem[]
}

const cartSchema = new mongoose.Schema<ICart>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
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
const Cart = mongoose.model<ICart>("Cart", cartSchema)
export default Cart
