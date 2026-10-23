import { z } from "zod";

export const SampleSchema = z.object({
  name: z.string(),
  age: z.number().min(18),
});

export type ISample = z.infer<typeof SampleSchema>
;
