import { z } from "zod"
const payload = {
  body: z.object({
    user: z.string({ required_error: "Add user ID to order" }),
    shipping: z.boolean({
      required_error:
        "Add information about the shipping of the order true or false",
    }),
  }),
}
export const createOrderSchema = z.object({ ...payload })
export const getUserOrdersSchema = z.object({
  body: z.object({
    user: z.string({ required_error: "Add user ID to get his orders" }),
  }),
})
export const getOrderSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Add the id of the order into params" }),
  }),
})
