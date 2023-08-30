import mongoose from "mongoose"

interface IWishlistItem {
  product: mongoose.Types.ObjectId
}

interface IWishlist extends mongoose.Document {
  user?: mongoose.Types.ObjectId
  items?: IWishlistItem[]
}

const wishlistSchema = new mongoose.Schema<IWishlist>({
  user: { type: mongoose.Types.ObjectId, ref: "User", require: true },
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
})
const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema)

export default WishlistModel
