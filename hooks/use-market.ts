import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { onitMarketsClient } from "@/app/client";

import type { Address } from "viem";
import type { ExtractResponseType } from "onit-markets";

type GetMarketResult = ExtractResponseType<
  (typeof onitMarketsClient.markets)[":marketAddress"]["$get"]
>;

export const getMarketQueryOptions = <
  T extends Omit<UseQueryOptions<GetMarketResult>, "queryKey" | "queryFn">
>(
  marketAddress: Address,
  opts?: T
) =>
  queryOptions({
    ...opts,
    enabled: !!marketAddress && (opts?.enabled ?? true),
    queryKey: ["onit-markets", "market", marketAddress],
    async queryFn() {
      const response = await onitMarketsClient.markets[":marketAddress"].$get({
        param: { marketAddress },
      });

      if (!response.ok) {
        throw new Error("Failed to get market");
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error("Failed to get market");
      }

      return json.data;
    },
  });

/**
 * Hook to get a market
 * @param marketAddress - The address of the market to get
 * @returns A query object for getting a market
 */
export function useMarket(
  marketAddress: Address,
  opts?: Omit<ReturnType<typeof getMarketQueryOptions>, "queryKey" | "queryFn">
) {
  return useQuery(getMarketQueryOptions(marketAddress, opts));
}
