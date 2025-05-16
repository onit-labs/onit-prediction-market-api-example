import {
	InfiniteData,
	infiniteQueryOptions,
	useInfiniteQuery,
	UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { onitMarketsClient } from "@/app/client";

import type { ExtractResponseType } from "onit-markets";

type GetMarketsResult = ExtractResponseType<
	(typeof onitMarketsClient.markets)["$get"]
>["markets"];

type GetMarketsQueryParams = Parameters<
	(typeof onitMarketsClient.markets)["$get"]
>[0]["query"];

export const getMarketsQueryOptions = <
	T extends Omit<
		UseInfiniteQueryOptions<
			GetMarketsResult,
			Error,
			InfiniteData<GetMarketsResult, number>,
			GetMarketsResult,
			unknown[],
			number
		>,
		"queryKey" | "queryFn"
	>,
>(
	queryParams: GetMarketsQueryParams,
	opts?: T,
) =>
	infiniteQueryOptions({
		...opts,
		queryKey: ["onit-markets", "markets", queryParams],
		async queryFn({ pageParam = 0 }) {
			const response = await onitMarketsClient.markets.$get({
				query: {
					...queryParams,
					offset: String(pageParam),
				},
			});

			if (!response.ok) {
				throw new Error("Failed to get market");
			}

			const json = await response.json();

			if (!json.success) {
				throw new Error("Failed to get market");
			}

			return json.data.markets;
		},
		initialPageParam: 0,
		getNextPageParam(lastPage, _pages, lastPageParam: number) {
			const hasNextPage =
				lastPage.length > 0 &&
				lastPage.length >= Number(queryParams?.limit ?? 10);

			// return null when there are no more markets
			if (!hasNextPage) return null;

			if (!lastPage || !Array.isArray(lastPage)) return lastPageParam;
			return lastPageParam + (lastPage?.length ?? 0);
		},
	});

/**
 * Hook to get a market
 * @param marketAddress - The address of the market to get
 * @returns A query object for getting a market
 */
export function useMarkets(
	queryParams: GetMarketsQueryParams,
	opts?: Omit<
		ReturnType<typeof getMarketsQueryOptions>,
		"queryKey" | "queryFn"
	>,
) {
	return useInfiniteQuery(getMarketsQueryOptions(queryParams, opts));
}
