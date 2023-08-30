import mongoose, { Query } from "mongoose"
import Product, { IProduct } from "./product.model"

export interface IReviewDocument extends mongoose.Document {
  rating: number
  body: string
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  _tempReview: any
}
interface IReviewModel extends mongoose.Model<IReviewDocument> {
  calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>
}

interface IReviewQuery extends mongoose.Query<{}, {}, "find"> {
  temp?: any
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

//update the product statics in case new review added
reviewSchema.post("save", async function () {
  await (this.constructor as IReviewModel).calcAverageRatings(this.product)
})
// one review for user on the same product
// preventing duplicated reviews from the same user
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// External variable to store data between pre and post hooks
var preFindReview: IReviewDocument | null = null

// update the product statics in case review updated of deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // in pre find this keyWord refer to the query
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
  }
})

/*
reviewSchema.pre(
  /^findOneAnd/,
  async function (this: Query<any, IReviewDocument | null>, next) {
    this._tempReview = (await this.findOne()) as IReviewDocument
    next()
  }
)

reviewSchema.post(
  /^findOneAnd/,
  async function (this: Query<any, IReviewDocument | null>, doc) {
    if (this._tempReview) {
      const ReviewModel = this.model("Review") // Access the model with type
      await ReviewModel.calcAverageRatings(this._tempReview.tour)
    }
  }
)
*/

const ReviewModel = mongoose.model<IReviewDocument, IReviewModel>(
  "Review",
  reviewSchema
)
export default ReviewModel
