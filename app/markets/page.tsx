import { getMarketsQueryOptions } from "@/hooks/use-markets";
import { getQueryClient } from "@/lib/query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Markets } from "./markets";

export default async function MarketsPage() {
	const queryClient = getQueryClient();

	await queryClient.prefetchInfiniteQuery(
		getMarketsQueryOptions({ limit: "10" }),
	);

	return (
		<Suspense fallback={null}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Markets />
			</HydrationBoundary>
		</Suspense>
	);
}
