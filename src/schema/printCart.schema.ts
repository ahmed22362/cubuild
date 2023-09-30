import { object, string, number, array, TypeOf, z } from "zod"

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
export const addFileToPrintCartSchema = z.object({
  params: z.object({
    PrintCartItemId: z.string({
      required_error: "Please insert the id of the cart into params",
    }),
  }),
  body: z.object({
    user: z.string({
      required_error: "Insert the ID of the user in the body!",
    }),
  }),
})
export const deleteFileFromPrintCartSchema = z.object({
  body: z.object({
    fileName: z.string({ required_error: "Please add file name!" }),
    b2FileId: z.string({ required_error: "please add file b2 id" }),
    user: z.string({ required_error: "Add user id to the body!" }),
  }),
})
export const adminUpdatePrintCartSchema = z.object({
  body: z.object({
    status: z.string({
      required_error: "update the Status of the print cart!",
    }),
    price: z.number({ required_error: "Add price to the print cart!" }),
  }),
})
