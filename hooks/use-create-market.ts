import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onitMarketsClient } from "@/app/client";

type CreateMarketRequest = Parameters<
  typeof onitMarketsClient.markets.$post
>[0]["json"];

/**
 * Hook to create a market
 * @returns A mutation object for creating a market
 */
export function useCreateMarket() {
  return useMutation({
    async mutationFn(market: CreateMarketRequest) {
      // Call the markets post endpoint
      const response = await onitMarketsClient.markets
        .$post({ json: market })
        .then((res) => res.json());

      if (!response.success) {
        throw new Error("Failed to create market");
      }

      return response.data;
    },
    onSuccess: (response) => {
      toast.success(
        `Market created successfully! Address: ${response.marketAddress}`
      );
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "Failed to create market");
    },
  });
}
