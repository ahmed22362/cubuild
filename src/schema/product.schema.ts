import { z } from "zod"

const payload = {
  body: z
    .object({
      title: z.string({
        required_error: "Title is required",
      }),
      description: z
        .string({ required_error: "Description is required" })
        .min(120, "Description should be at least 120 characters long"),
      price: z.number({ required_error: "Price is required" }),
      coverImage: z.string({ required_error: "Price is required" }),
      images: z.array(z.string()),
      options: z.array(
        z.object({ name: z.string(), values: z.array(z.string()) })
      ),
    })
    .partial({ images: true, options: true }),
}
const params = {
  params: z.object({
    id: z.string({
      required_error: "product id is required",
    }),
  }),
}
export const createProductSchema = z.object({ ...payload })
export const updateProductSchema = z.object({
  ...payload.body.partial,
  ...params,
})
export const deleteProductSchema = z.object({ ...params })
export const getProductSchema = z.object({ ...params })
