import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import SuperJSON from "superjson";
import { isAddress } from "viem";

import type { Address } from "viem";

// see https://markets.onit-labs.workers.dev/api/~/docs#tag/default/GET/api/markets/{marketAddress}
const getMarketResponseSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") return SuperJSON.parse(val);
    return val;
  },
  z.object({
    success: z.boolean(),
    data: z.object({
      marketAddress: z.string().refine((val): val is Address => isAddress(val)),
      question: z.string(),
      resolutionCriteria: z.string(),
      bettingCutoff: z.coerce.bigint(),
      marketType: z.enum(["spread", "days-until"]),
      metadata: z.record(z.string(), z.unknown()).optional(),
      createdAt: z.coerce.date(),
      deploymentTxHash: z.string(),
      questionDescription: z.string().nullable(),
      kappa: z.coerce.bigint(),
      totalQSquared: z.coerce.bigint(),
      outcomeUnit: z.coerce.bigint(),
      isActive: z.boolean(),
      resolvedBy: z.string().nullable(),
      resolvedOutcome: z.coerce.bigint().nullable(),
      shareCountInResolvedOutcome: z.coerce.bigint().nullable(),
      withdrawalDelay: z.coerce.bigint(),
      voidedBy: z.string().nullable(),
      expiresAt: z.coerce.date(),
      voidedAt: z.coerce.date().nullable(),
      resolvedAt: z.coerce.date().nullable(),
    }),
  })
);

type GetMarketResponse = z.infer<typeof getMarketResponseSchema>["data"];

async function getMarketQueryFn(
  marketAddress: Address
): Promise<GetMarketResponse> {
  if (!isAddress(marketAddress)) {
    throw new Error("Invalid market address");
  }

  const response = await fetch(`/api/proxy/markets/${marketAddress}`);

  if (!response.ok) {
    throw new Error("Failed to get market", {
      cause: await response.text(),
    });
  }

  const { data } = getMarketResponseSchema.parse(await response.text());

  return data;
}

/**
 * Hook to get a market
 * @param marketAddress - The address of the market to get
 * @returns A query object for getting a market
 */
export function useMarket(marketAddress: Address) {
  const query = useQuery({
    queryKey: ["market", marketAddress],
    queryFn: () => getMarketQueryFn(marketAddress),
  });

  return query;
}
