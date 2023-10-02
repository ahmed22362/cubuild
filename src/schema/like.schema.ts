import { z } from "zod"
const payload = {
  body: z.object({
    user: z.string({ required_error: "Please add the user id to the body!" }),
  }),
  review: z.string({
    required_error: "Please add review Id to the body!",
  }),
}

export const addLikeSchema = z.object({ ...payload })
export const deleteLikeSchema = z.object({ ...payload })
