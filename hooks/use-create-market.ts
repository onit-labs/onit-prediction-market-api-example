import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Client } from "onit-markets";
import { getApiResponseSchema } from "onit-markets";
import client from "@/app/client";
import SuperJSON from "superjson";

type CreateMarketResponse = z.infer<ReturnType<typeof getApiResponseSchema>>;

/**
 * Hook to create a market
 * @returns A mutation object for creating a market
 */
export function useCreateMarket() {
  const mutation = useMutation<CreateMarketResponse, Error, Parameters<Client["api"]["markets"]["$post"]>[0]["body"]>({
    mutationFn: async (market) => {
      const response = await client.api.markets.$post({
        json: SuperJSON.stringify(market)
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to create market");
      }

      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Market created successfully");
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "Failed to create market");
    },
  });

  return mutation;
}
