import { useSendTransaction } from "wagmi";
import { useGetBetCalldata } from "./use-get-bet-calldata";

import type { UseSendTransactionParameters } from "wagmi";
import type { GetBetCalldataParams } from "./use-get-bet-calldata";
import type { Address } from "viem";

/**
 * Hook to make a bet
 * @returns a mutation that takes a bet object and gets the calldata for that bet, then sends the transaction
 */
export function useMakeBet(
  args: GetBetCalldataParams,
  opts: UseSendTransactionParameters
) {
  const { sendTransaction, sendTransactionAsync, ...rest } =
    useSendTransaction(opts);

  const { data: betData } = useGetBetCalldata(args);

  const makeBet = (opts: Parameters<typeof sendTransaction>[1]) => {
    if (!betData) {
      throw new Error("Failed to generate bet calldata: No bet calldata found");
    }

    // Send the transaction
    const hash = sendTransaction(
      {
        to: betData.to as Address,
        value: BigInt(betData.value),
        data: betData.calldata,
      },
      opts
    );

    return { hash };
  };

  const makeBetAsync = async (
    opts: Parameters<typeof sendTransactionAsync>[1]
  ) => {
    if (!betData) {
      throw new Error("Failed to generate bet calldata: No bet calldata found");
    }

    // Send the transaction
    const hash = await sendTransactionAsync(
      {
        to: betData.to as Address,
        value: BigInt(betData.value),
        data: betData.calldata,
      },
      opts
    );

    return { hash };
  };

  return {
    ...rest,
    makeBet,
    makeBetAsync,
  };
}
