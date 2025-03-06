import { z } from "zod";
import { createMarketFormSchema } from "@/lib/validators";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SuperJSON from "superjson";

async function createMarketQueryFn(
  market: z.infer<typeof createMarketFormSchema>
) {
  // Default body for all markets
  let body: Record<string, unknown> = {
    bettingCutoff: 0,
  };

  switch (market.marketType) {
    case "spread":
      body = {
        ...body,
        ...market,
      };
      break;
    default:
      throw new Error("Not implemented");
  }

  const response = await fetch("/api/proxy/markets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: SuperJSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to create market", {
      cause: await response.text(),
    });
  }

  return await response.json();
}

/**
 * Hook to create a market
 * @returns A mutation object for creating a market
 */
export function useCreateMarket() {
  const mutation = useMutation({
    mutationFn: createMarketQueryFn,
    onSuccess: () => {
      toast.success("Market created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create market");
    },
  });

  return mutation;
}
