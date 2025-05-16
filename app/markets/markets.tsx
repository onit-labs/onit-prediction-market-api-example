"use client";

import { useMarkets } from "@/hooks/use-markets";

export function Markets() {
	const { data } = useMarkets({
		limit: "10",
	});

	const markets = data?.pages.flat();

	return (
		<div>
			<h1>Markets</h1>
			{markets?.map((market) => (
				<div key={market.marketAddress}>
					<h2>{market.question}</h2>
					<p>{market.resolutionCriteria}</p>
				</div>
			))}
		</div>
	);
}
