import mongoose from "mongoose"

export interface ICartItem {
  _id: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  quantity: number
}
export interface ICart extends mongoose.Document {
  user?: mongoose.Types.ObjectId
  items: ICartItem[]
}

const cartSchema = new mongoose.Schema<ICart>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
})

cartSchema.pre(/^find/, function (next) {
  const cart = this as ICart
  cart.populate({ path: "items.product", select: "title price images" })
  next()
})
const Cart = mongoose.model<ICart>("Cart", cartSchema)
export default Cart
