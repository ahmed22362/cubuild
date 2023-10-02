import { z } from "zod"
const payload = {
  body: z.object({
    name: z.string({ required_error: "Please Enter Name for this offer" }),
    description: z.string().optional(),
    discount: z.number({
      required_error: "Please enter the amount of the discount!",
    }),
    start: z.date({
      required_error: "Please enter the start date of this offer!",
    }),
    end: z.date({
      required_error: "Please enter the date of the offer",
    }),
  }),
}

export const createOfferSchema = z.object({ ...payload })
export const updateOfferSchema = z.object({ ...payload.body.partial })
