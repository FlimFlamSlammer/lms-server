import { z } from "zod";

export const getExampleQuerySchema = z.object({
  id: z.string(),
});
