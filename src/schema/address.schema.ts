import { optional, z } from "zod";

export const addressSchema = z.optional(
  z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
);

export type AddressInput = z.infer<typeof addressSchema>;
