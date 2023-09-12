import mongoose from "mongoose"

export interface IReviewRating {
  rate_1_count: number
  rate_2_count: number
  rate_3_count: number
  rate_4_count: number
  rate_5_count: number
}
export interface IProduct extends mongoose.Document {
  title: string
  description: string
  price: number
  coverImage: string
  images: string[]
  tags: string[]
  options: {
    name: string
    values: string[]
  }[]
  ratingsAverage: number
  ratingsQuantity: number
  ratingsGroup: IReviewRating
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, require: true },
    images: [{ type: String }],
    tags: [{ type: String }],
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
    ratingsGroup: {
      rate_1_count: Number,
      rate_2_count: Number,
      rate_3_count: Number,
      rate_4_count: Number,
      rate_5_count: Number,
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
