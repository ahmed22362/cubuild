import { z } from "zod"

export const AddItemToCartSchema = z.object({
  body: z.object({
    user: z.string(),
    product: z.string(),
    quantity: z.number(),
  }),
})
export const updateItemFromCartSchema = z.object({
  body: z.object({ quantity: z.number(), user: z.string() }),
  params: z.object({ itemId: z.string() }),
})
export const deleteItemFromCartSchema = z.object({
  body: z.object({ user: z.string() }),
  params: z.object({ itemId: z.string() }),
})
export const getCartSchema = z.object({
  body: z.object({ user: z.string() }),
})
