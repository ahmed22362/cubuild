import { object, z } from "zod"
import { CustomOrderStatus } from "../models/printCart.model"
const payload = {
  body: z.object({
    cartItemId: z.string({
      required_error: "To Create Order add cartItemId in the body!",
    }),
    shipping: z.boolean({
      required_error:
        "Please Add if there is shipping or not as boolean value!",
    }),
  }),
}
const params = {
  params: z.object({
    id: z.string({
      required_error: "Please Add id to params",
    }),
  }),
}

const statusEnum: z.ZodEnum<[string, ...string[]]> = z.enum([
  "pending",
  "processing",
  "shipping",
  "shipped",
  "delivered",
  "completed",
  "not valid",
])

export const createPrintOrderSchema = z.object({ ...payload })
export const getUserPrintOrdersSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "Please insert user id to get his orders!",
    }),
  }),
})
export const getUserOnePrintOrderSchema = z.object({ ...params })
export const updateUserPrintOrderSchema = z.object({
  body: z.object({ status: statusEnum }),
})
export const deleteUserPrintOrderSchema = z.object({ ...params })
