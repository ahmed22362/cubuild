import mongoose from "mongoose"

interface IWishlistItem {
  id: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
}

export interface IWishlist extends mongoose.Document {
  user?: mongoose.Types.ObjectId
  items?: IWishlistItem[]
}

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    items: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          auto: true,
        },
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        added_on: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

wishlistSchema.index(
  {
    "items.product": 1,
    user: 1,
  },
  { unique: true }
)
const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema)

export default WishlistModel
