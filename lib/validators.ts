import { z } from "zod";
import {
  createDaysUntilMarketSchema,
  createScoreMarketSchema,
  createDiscreteMarketSchema,
  createNormalMarketSchema,
  createPercentageMarketSchema,
} from "onit-markets/validators";

export const baseBetSchema = z.object({
  question: z.string().min(1),
  resolutionCriteria: z.string(),
});

export const scoreMarketSideMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const scoreBetSchema = baseBetSchema.extend({
  marketType: z.literal("score"),
  bettingCutoff: z.coerce.bigint(),
  initialBet: z.object({
    firstSideScore: z.coerce.number().min(0),
    secondSideScore: z.coerce.number().min(0),
  }),
  metadata: z.object({
    firstSide: scoreMarketSideMetadataSchema,
    secondSide: scoreMarketSideMetadataSchema,
    tags: z.union([
      z.string().transform((val) =>
        val
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      ),
      z.array(z.string()),
    ]),
  }),
});

export const daysUntilSchema = baseBetSchema.extend({
  marketType: z.literal("days-until"),
  daysUntil: z.number().min(1),
  bettingCutoff: z.coerce.bigint().optional(),
});

export const createMarketFormSchema = z.union([
  createScoreMarketSchema,
  createDaysUntilMarketSchema,
  createDiscreteMarketSchema,
  createNormalMarketSchema,
  createPercentageMarketSchema,
]);

export type CreateMarketSchema =
  | z.infer<typeof createScoreMarketSchema>
  | z.infer<typeof createDiscreteMarketSchema>
  | z.infer<typeof createDaysUntilMarketSchema>
  | z.infer<typeof createNormalMarketSchema>
  | z.infer<typeof createPercentageMarketSchema>;
