import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import SuperJSON from "superjson";
import { isAddress } from "viem";

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

  const response = await fetch(
    `/api/proxy/markets/${marketAddress}/participants`
  );

  if (!response.ok) {
    throw new Error("Failed to get market", {
      cause: await response.text(),
    });
  }

  const { data } = getMarketParticipantsResponseSchema.parse(
    await response.text()
  );

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
