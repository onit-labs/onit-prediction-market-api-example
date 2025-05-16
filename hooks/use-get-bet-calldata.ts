import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { onitMarketsClient } from "@/app/client";
import { ExtractResponseType } from "onit-markets";

type GetBetQueryArgs = Parameters<
  (typeof onitMarketsClient.markets)[":marketAddress"]["bet"]["$get"]
>[0];

type GetBetCalldataResult = ExtractResponseType<
  (typeof onitMarketsClient.markets)[":marketAddress"]["bet"]["$get"]
>;

export type GetBetCalldataParams = GetBetQueryArgs["query"] & {
  marketAddress: GetBetQueryArgs["param"]["marketAddress"];
};

export const getBetCalldataQueryOptions = <
  T extends Omit<UseQueryOptions<GetBetCalldataResult>, "queryKey" | "queryFn">
>(
  args: GetBetCalldataParams,
  opts?: T
) =>
  queryOptions({
    ...opts,
    enabled: !!args.marketAddress && (opts?.enabled ?? true),
    queryKey: ["onit-markets", "bet", args],
    async queryFn() {
      const { marketAddress, ...query } = args;
      const response = await onitMarketsClient.markets[
        ":marketAddress"
      ].bet.$get({ param: { marketAddress }, query });

      if (!response.ok) {
        throw new Error("Failed to get bet calldata");
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error("Failed to get bet calldata");
      }

      return json.data;
    },
  });

/**
 * Hook to get calldata needed for submitting a bet to a market contract
 * @returns A query object for getting bet calldata
 */
export function useGetBetCalldata(
  args: GetBetCalldataParams,
  opts?: Omit<
    ReturnType<typeof getBetCalldataQueryOptions>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery(getBetCalldataQueryOptions(args, opts));
}
