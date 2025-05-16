import { onitMarketsClient } from "@/app/client";
import { queryOptions, useQuery } from "@tanstack/react-query";

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ExtractResponseType } from "onit-markets";
import type { Address } from "viem";

type GetMarketParticipantsResult = ExtractResponseType<
  (typeof onitMarketsClient.markets)[":marketAddress"]["participants"]["$get"]
>;

export const getMarketParticipantsQueryOptions = <
  T extends Omit<
    UseQueryOptions<GetMarketParticipantsResult>,
    "queryKey" | "queryFn"
  >
>(
  marketAddress: Address,
  opts?: T
) =>
  queryOptions({
    ...opts,
    enabled: !!marketAddress && (opts?.enabled ?? true),
    queryKey: ["onit-markets", "market-participants", marketAddress],
    async queryFn() {
      const response = await onitMarketsClient.markets[
        ":marketAddress"
      ].participants.$get({ param: { marketAddress } });

      if (!response.ok) {
        throw new Error("Failed to get market participants");
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error("Failed to get market participants");
      }

      return json.data;
    },
  });

/**
 * Hook to get a market's participants
 * @param marketAddress - The address of the market to get participants for
 * @returns A query object for getting a market's participants
 */
export function useMarketParticipants(
  marketAddress: Address,
  opts?: Omit<
    ReturnType<typeof getMarketParticipantsQueryOptions>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery(getMarketParticipantsQueryOptions(marketAddress, opts));
}
