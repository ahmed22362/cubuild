import mongoose, { Query } from "mongoose"
import Product, { IProduct } from "./product.model"
import AppError from "../utils/AppError"

export interface IReviewDocument extends mongoose.Document {
  rating: number
  body: string
  title: string
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  likeCount: number
}
interface IReviewModel extends mongoose.Model<IReviewDocument> {
  calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>
  calcRatingsGroups(productId: mongoose.Types.ObjectId): Promise<void>
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    rating: { type: Number, default: 1, required: true, min: 1, max: 5 },
    body: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    title: { type: String },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must have user"],
    },
    likeCount: { type: Number, default: 0 },
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

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stat = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ])
  if (stat.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stat[0].nRating,
      ratingsAverage: stat[0].avgRating,
    })
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  }
}
reviewSchema.statics.calcRatingsGroups = async function (productId) {
  try {
    const stat = await this.aggregate([
      {
        $match: { product: productId },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          ratingValue: { $first: "$rating" },
        },
      },
    ])
    const product = await Product.findById(productId)

    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`)
    }

    const ratingsCount: any = {}

    stat.forEach((item) => {
      ratingsCount[`rate_${item._id}_count`] = item.count || 0
    })

    product.ratingsGroup = ratingsCount

    await product.save()

    console.log(`Ratings groups updated for product: ${product.title}`)
  } catch (error) {
    console.error("Error in calcRatingsGroups:", error)
    throw new AppError(400, "Can't aggregate reviews!")
  }
}

//update the product statics in case new review added
reviewSchema.post("save", async function () {
  await (this.constructor as IReviewModel).calcAverageRatings(this.product)
  await (this.constructor as IReviewModel).calcRatingsGroups(this.product)
})
// one review for user on the same product
// preventing duplicated reviews from the same user
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// External variable to store data between pre and post hooks
var preFindReview: IReviewDocument | null = null

// update the product statics in case review updated or deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // in pre find "this" keyWord refers to the query
  // so to get the current document we make findOne on the model
  const query: Query<IReviewDocument | null, IReviewDocument> = this as any
  preFindReview = await query.model.findOne(query.getQuery())
  next()
})

// no update the calcs of the product that the review was on
// we used post so we get the updated document
reviewSchema.post(/^findOneAnd/, async function () {
  if (preFindReview) {
    await (preFindReview.constructor as IReviewModel).calcAverageRatings(
      preFindReview.product
    )
    await (preFindReview.constructor as IReviewModel).calcRatingsGroups(
      preFindReview.product
    )
  }
})

const ReviewModel = mongoose.model<IReviewDocument, IReviewModel>(
  "Review",
  reviewSchema
)
export default ReviewModel
