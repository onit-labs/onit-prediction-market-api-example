import { useQuery } from "@tanstack/react-query";
import { onitMarketsClient } from "@/app/client";
import type { Address } from "viem";

/**
 * Hook to get a market
 * @param marketAddress - The address of the market to get
 * @returns A query object for getting a market
 */
export function useMarket(marketAddress: Address) {
  const query = useQuery({
    queryKey: ["market", marketAddress],
    queryFn: async () => {
      const marketDeploymentRes = await onitMarketsClient.markets[":marketAddress"]
        .$get({ param: { marketAddress } }).then((res) => res.json());

      if (!marketDeploymentRes.success) {
        throw new Error("Failed to get market");
      }

      return marketDeploymentRes.data;
    },
    enabled: !!marketAddress,
  });

  return query;
}
