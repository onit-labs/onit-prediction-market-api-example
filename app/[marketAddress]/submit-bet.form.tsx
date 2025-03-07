"use client";

import { useMarket } from "@/hooks/use-market";
import { useParams } from "next/navigation";
import { bigIntReplacer } from "@/lib/utils";

import { parseEther, type Address } from "viem";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMarketParticipants } from "@/hooks/use-market-participants";
import { useMakeBet } from "@/hooks/use-make-bet";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

const submitBetFormSchema = z.object({
  amount: z.coerce.bigint(),
});

export default function SubmitBetForm() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { marketAddress } = useParams<{ marketAddress: Address }>();
  const { data: market, error } = useMarket(marketAddress);
  const { data: marketParticipants, error: marketParticipantsError } =
    useMarketParticipants(marketAddress);
  const { mutate: makeBet, isPending: isSubmittingBet, data: madeBetTxHash } = useMakeBet();

  const form = useForm<z.infer<typeof submitBetFormSchema>>({
    resolver: zodResolver(submitBetFormSchema),
  });

  const amount = form.watch("amount");

  // Check if wallet is connected, if not, try to connect
  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [connectors, isConnected, connect]);

  console.log("market", market);
  console.log("amount", amount);

  function onSubmit(values: z.infer<typeof submitBetFormSchema>) {
    makeBet(
      {
        marketAddress,
        marketType: 'spread',
        bet: '2-1',
        value: parseEther(values.amount.toString()),
      },
      {
        onSuccess: (result) => {
          console.log("Bet placed successfully!", result);
        },
        onError: (error) => {
          console.error("Error placing bet:", error);
        }
      }
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl font-bold">Market Details</h2>
        <pre className="text-xs max-w-md overflow-x-scroll">
          {JSON.stringify(market, bigIntReplacer, 2)}
        </pre>

        <h2 className="text-2xl font-bold">Market Participants</h2>
        <pre className="text-xs max-w-md overflow-x-scroll">
          {JSON.stringify(marketParticipants, bigIntReplacer, 2)}
        </pre>

        <h2 className="mt-8 text-2xl font-bold">Submit Bet</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-md"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormDescription>
                    The amount of ETH to bet. (Currently{" "}
                    {field.value?.toString() ?? "0"} ETH - submitted as{" "}
                    {parseEther(field.value?.toString() ?? "0")} wei)
                  </FormDescription>
                  <FormControl>
                    <Input
                      className="text-sm max-w-sm"
                      type="number"
                      min={0}
                      step={0.01}
                      {...field}
                      value={field.value?.toString() ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmittingBet}
            >
              {isSubmittingBet ? "Placing bet..." : "Submit Bet"}
            </Button>
          </form>
        </Form>
      </div>

      {!!madeBetTxHash && (
        <>
          <pre className="mt-2 text-sm w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(madeBetTxHash, bigIntReplacer, 2)}
            </code>
          </pre>

        </>
      )}
    </div>
  );
}
