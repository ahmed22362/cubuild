import { z } from "zod"

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .refine((value) => value.type === "Point", {
      message: "Invalid location type",
    })
    .refine(
      (value) =>
        Array.isArray(value.coordinates) && value.coordinates.length === 2,
      {
        message: "Coordinates must be an array of two numbers",
      }
    ),
})

export type AddressInput = z.infer<typeof addressSchema>
