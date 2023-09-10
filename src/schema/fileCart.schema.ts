import { z } from "zod"

export const createFileCartSchema = z.object({
  body: z
    .object({
      user: z.string(),
      description: z.string(),
      options: z.array(
        z.object({ name: z.string(), values: z.array(z.string()) })
      ),
    })
    .partial({ description: true, options: true }),
  files: z.any(),
})

export const getFileCartSchema = z.object({
  body: z.object({
    user: z.string(),
  }),
})
