import { object, string, number, array, TypeOf, z } from "zod"

const fileSchema = object({
  fileName: string().nonempty({ message: "Please provide name for the file" }),
  b2FileUrl: string().nonempty({ message: "Please provide url for the file" }),
  b2FileId: string().nonempty({ message: "Please provide B2 Id for the file" }),
})

const optionSchema = object({
  name: string(),
  values: array(string()),
})

export const createPrintCartSchema = z.object({
  body: z
    .object({
      user: z.string(),
      description: z.string(),
      options: z.array(optionSchema),
    })
    .partial({ description: true, options: true }),
})

export const getPrintCartSchema = z.object({
  body: z.object({
    user: z.string(),
  }),
})
export const getPrintCarItemSchema = z.object({
  params: z.object({
    PrintCartItemId: z.string({
      required_error: "Please Add Id in the params to get the item details!",
    }),
  }),
})
export const updatePrintCartItemOptionsSchema = z.object({
  body: z
    .object({
      options: z.array(optionSchema),
      user: z.string(),
    })
    .partial({ options: true }),
})
