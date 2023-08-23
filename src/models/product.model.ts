import mongoose from "mongoose"

interface IProduct extends mongoose.Document {
  title: string
  description: string
  price: number
  images: string[]
  options: {
    name: string
    values: string[]
  }[]
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    options: [{ name: { type: String }, values: [{ type: String }] }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
})
const Product = mongoose.model<IProduct>("Product", productSchema)

export default Product
