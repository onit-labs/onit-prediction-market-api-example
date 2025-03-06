import { z } from "zod";

export const baseBetSchema = z.object({
  question: z.string().min(1),
  resolutionCriteria: z.string(),
});

export const spreadMarketSideMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const spreadBetSchema = baseBetSchema.extend({
  marketType: z.literal("spread"),
  bettingCutoff: z.coerce.bigint(),
  initialBet: z.object({
    firstSideScore: z.coerce.number().min(0),
    secondSideScore: z.coerce.number().min(0),
  }),
  metadata: z.object({
    firstSide: spreadMarketSideMetadataSchema,
    secondSide: spreadMarketSideMetadataSchema,
  }),
});

export const daysUntilSchema = baseBetSchema.extend({
  marketType: z.literal("days-until"),
  daysUntil: z.number().min(1),
  bettingCutoff: z.coerce.bigint().optional(),
});

export const createMarketFormSchema = z.discriminatedUnion("marketType", [
  spreadBetSchema,
  daysUntilSchema,
]);
