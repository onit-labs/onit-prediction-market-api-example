import { useMutation } from "@tanstack/react-query";
import { useSendTransaction } from "wagmi";
import { GetBetCalldataParams, getBetCalldataQueryFn } from "./use-get-bet-calldata";
import { Address } from "viem";

/**
 * Hook to make a bet
 * @returns a mutation that takes a bet object and gets the calldata for that bet, then sends the transaction
 */
export function useMakeBet() {
    const { sendTransactionAsync } = useSendTransaction();

    return useMutation({
        mutationFn: async (params: GetBetCalldataParams) => {
            // Get the calldata for the bet
            const calldataResponse = await getBetCalldataQueryFn(params);

            if (!calldataResponse?.success) {
                throw new Error("Failed to generate bet calldata: API returned unsuccessful response");
            }

            // Extract the data we need for the transaction
            const { data: betData } = calldataResponse;

            // Send the transaction
            const hash = await sendTransactionAsync({
                to: betData.to as Address,
                value: BigInt(betData.value),
                data: betData.calldata,
            });

            return { hash };
        }
    });
} 