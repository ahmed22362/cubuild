import mongoose from "mongoose"

interface IOffer extends mongoose.Document {
  name: string
  description?: string
  discount: number
  active: boolean
  start: Date
  end: Date
}

const offerSchema = new mongoose.Schema<IOffer>({
  name: { type: String, required: true },
  description: { type: String },
  discount: { type: Number, required: true },
  active: { type: Boolean, default: true },
  start: { type: Date, default: new Date() },
  end: {
    type: Date,
    default: function () {
      // add week to the start date
      return new Date(this.start.getTime() + 24 * 60 * 60 * 1000 * 7)
    },
  },
})

const offer = mongoose.model<IOffer>("Offer", offerSchema)

export default offer
