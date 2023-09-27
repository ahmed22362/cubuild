import { z } from "zod"

const payload = {
  body: z.object({
    product: z.string({
      required_error:
        "Wishlist must have a product -- insert the id of the product as string-- ",
    }),
    user: z.string({
      required_error:
        "Wishlist must have a user -- insert the id of the user as string-- ",
    }),
  }),
}
export const createWishListSchema = z.object({ ...payload })
export const getUserWishListSchema = z.object({
  body: z.object({
    user: z.string({
      required_error:
        "Wishlist must have a user -- insert the id of the user as string--",
    }),
  }),
})
export const deleteProductFromWishlistSchema = z.object({ ...payload })
