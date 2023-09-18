import mongoose from "mongoose"
import { IOrder, baseOrderSchema } from "./order.model"
import { IFileItem } from "./printCart.model"

interface IPrintOrder extends IOrder {
  files: IFileItem[]
  printCost: number
}

const PrintOrderSchema = new mongoose.Schema<IPrintOrder>({
  ...baseOrderSchema.obj,
  printCost: Number,
  files: [
    {
      fileName: {
        type: String,
        require: [true, "please provide name for the file "],
      },
      b2FileUrl: {
        type: String,
        require: [true, "please provide url for the file"],
      },
      b2FileId: {
        type: String,
        require: [true, "please provide B2 Id for the file"],
      },
    },
  ],
})

const PrintOrderModel = mongoose.model<IPrintOrder>(
  "PrintOrder",
  PrintOrderSchema
)
export default PrintOrderModel
