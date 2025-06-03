import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import SuperJSON from "superjson";
import { isAddress } from "viem";
import { onitMarketsClient } from "@/app/client";

import type { Address } from "viem";

// see https://markets.onit-labs.workers.dev/api/~/docs#tag/default/GET/api/markets/{marketAddress}/participants
const getMarketParticipantsResponseSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") return SuperJSON.parse(val);
    return val;
  },
  z.object({
    success: z.boolean(),
    data: z.object({}).passthrough(),
  })
);

type GetMarketParticipantsResponse = z.infer<
  typeof getMarketParticipantsResponseSchema
>["data"];

async function getMarketParticipantsQueryFn(
  marketAddress: Address
): Promise<GetMarketParticipantsResponse> {
  if (!isAddress(marketAddress)) {
    throw new Error("Invalid market address");
  }

  const response = await onitMarketsClient.markets[":marketAddress"].participants.$get({
    param: { marketAddress }
  });
  const json = await response.json();
  const { data } = getMarketParticipantsResponseSchema.parse(JSON.stringify(json));
  return data;
}

/**
 * Hook to get a market's participants
 * @param marketAddress - The address of the market to get participants for
 * @returns A query object for getting a market's participants
 */
export function useMarketParticipants(marketAddress: Address) {
  const query = useQuery({
    queryKey: ["market-participants", marketAddress],
    queryFn: () => getMarketParticipantsQueryFn(marketAddress),
  });

  return query;
}
