import mongoose from "mongoose"

export interface IReviewDocument extends mongoose.Document {
  rating: number
  body: string
  user: object
  product: object
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    rating: { type: Number, default: 1, required: true, min: 1, max: 5 },
    body: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must have user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.pre(/^find/, function (next) {
  const review = this as IReviewDocument
  review.populate({ path: "user", select: "name photo" })
  next()
})

const ReviewModel = mongoose.model<IReviewDocument>("Review", reviewSchema)
export default ReviewModel
