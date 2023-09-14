import mongoose, { Model, Query } from "mongoose"
import Review from "./review.model"

interface Like {
  user: mongoose.Types.ObjectId
  review: mongoose.Types.ObjectId
}

const LikeSchema = new mongoose.Schema<Like>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
})

LikeSchema.post<Like>("save", async function (doc) {
  // Increment count
  await Review.updateOne(
    {
      _id: doc.review,
    },
    {
      $inc: { likeCount: 1 },
    }
  )
})

var preFindLike: Like | null = null

LikeSchema.pre(/^findOneAnd/, async function (next) {
  const query: Query<Like | null, Like> = this as any
  preFindLike = await query.model.findOne(query.getQuery())
  console.log(preFindLike)
  next()
})

LikeSchema.post(/^findOneAnd/, async function () {
  if (preFindLike) {
    await Review.updateOne(
      {
        _id: preFindLike.review,
      },
      {
        $inc: { likeCount: -1 },
      }
    )
  }
})

LikeSchema.index({ user: 1, review: 1 }, { unique: true })

const Like: Model<Like> = mongoose.model("Like", LikeSchema)

export default Like
