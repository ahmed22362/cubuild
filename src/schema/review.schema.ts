import { z } from "zod"

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number(),
    body: z.optional(z.string()),
    title: z.optional(z.string()),
    product: z.string({
      required_error:
        "Review must have a product -- insert the id of the product as string-- ",
    }),
    user: z.string({
      required_error:
        "Review must have a user -- insert the id of the user as string-- ",
    }),
  }),
})
const params = {
  params: z.object({
    id: z.string({
      required_error: "product id is required",
    }),
  }),
}
export const getReviewSchema = z.object({ ...params })
export const updateReviewSchema = z.object({ ...params })
export const removeReviewSchema = z.object({ ...params })
