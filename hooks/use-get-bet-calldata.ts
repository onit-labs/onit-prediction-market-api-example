import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { isAddress, isHex } from "viem";

import type { Address, Hex } from "viem";
import { preprocessSuperJSON } from "@/lib/utils";
import { onitMarketsClient } from "@/app/client";

export const getBetCalldataResponseSchema = z.preprocess(
    preprocessSuperJSON,
    z.object({
        success: z.boolean(),
        data: z.object({
            type: z.literal("calldata"),
            to: z.string().refine((val): val is Address => isAddress(val)),
            value: z.string().or(z.bigint()), // Amount to be sent with transaction
            calldata: z.string().refine((val): val is Hex => isHex(val)),
        }),
    })
);

type GetBetCalldataResponse = z.infer<typeof getBetCalldataResponseSchema>;

export interface GetBetCalldataParams {
    marketAddress: Address;
    marketType: "score";
    bet: string; // Format: "firstSideScore-secondSideScore" (e.g., "2-1")
    value: bigint;
}

/**
 * Fetches calldata needed to submit a bet to a market contract
 */
export async function getBetCalldataQueryFn(
    bet: GetBetCalldataParams
): Promise<GetBetCalldataResponse> {
    // Only supporting 'spread' (score) markets for now
    const [firstSideScore, secondSideScore] = bet.bet.split("-").map(Number);
    if (
        isNaN(firstSideScore) ||
        isNaN(secondSideScore)
    ) {
        throw new Error("Only 'spread' (score) markets are supported and bet must be in 'firstSideScore-secondSideScore' format");
    }

    const response = await onitMarketsClient.markets[":marketAddress"].bet.$get({
        param: { marketAddress: bet.marketAddress },
        query: {
            value: bet.value.toString(),
            type: "calldata",
            bet: { firstSideScore, secondSideScore },
            marketType: "score"
        }
    });

    const json = await response.json();
    return getBetCalldataResponseSchema.parse(json);
}

/**
 * Hook to get calldata needed for submitting a bet to a market contract
 * @returns A mutation object for getting bet calldata
 */
export function useGetBetCalldata() {
    return useMutation({
        mutationFn: getBetCalldataQueryFn,
        onError: (error) => {
            console.error("Failed to get bet calldata:", error);
        },
    });
} 