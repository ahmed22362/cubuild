import mongoose from "mongoose"

export interface IProduct extends mongoose.Document {
  title: string
  description: string
  price: number
  coverImage: string
  images: string[]
  options: {
    name: string
    values: string[]
  }[]
  ratingsAverage: number
  ratingsQuantity: number
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, require: true },
    images: [{ type: String }],
    options: [{ name: { type: String }, values: [{ type: String }] }],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
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
