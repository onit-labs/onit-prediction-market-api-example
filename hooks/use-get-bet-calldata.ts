import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { isAddress, isHex } from "viem";

import type { Address, Hex } from "viem";
import { preprocessSuperJSON } from "@/lib/utils";

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
    marketType: "spread"; // Currently only supporting spread markets
    bet: string; // Format: "firstSideScore-secondSideScore" (e.g., "2-1")
    value: bigint;
}

/**
 * Fetches calldata needed to submit a bet to a market contract
 */
export async function getBetCalldataQueryFn(
    bet: GetBetCalldataParams
): Promise<GetBetCalldataResponse> {
    const params = new URLSearchParams({
        marketType: "spread",
        bet: bet.bet, // Format: "firstSideScore-secondSideScore"
        value: bet.value.toString(), // Convert bigint to string
        type: "calldata" // Will return the calldata to call to make the bet
    });

    const response = await fetch(`/api/proxy/markets/${bet.marketAddress}/bet?${params.toString()}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to get bet calldata", {
            cause: errorText,
        });
    }

    return getBetCalldataResponseSchema.parse(await response.text());
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