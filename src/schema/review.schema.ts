import { z } from "zod"

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number(),
    body: z.optional(z.string()),
    productId: z.string({
      required_error:
        "Review must have a product -- insert the id of the product as string-- ",
    }),
  }),
})
