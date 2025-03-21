import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import client from "@/app/client";

/**
 * Hook to create a market
 * @returns A mutation object for creating a market
 */
export function useCreateMarket() {
  const mutation = useMutation({
    mutationFn: async (market) => {
      // Call the markets post endpoint
      const response = await client.api.markets.$post({
        json: market
      }).then((res) => res.json());

      if (!response.success) {
        throw new Error("Failed to create market");
      }

      return response.data;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(`Market created successfully! Address: ${response.data.marketAddress}`);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "Failed to create market");
    },
  });

  return mutation;
}
