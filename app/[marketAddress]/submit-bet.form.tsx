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
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMarketParticipants } from "@/hooks/use-market-participants";
import { useMakeBet } from "@/hooks/use-make-bet";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { scoreMarketSideMetadataSchema } from "@/lib/validators";
import { isScoreMarket, ScoreMarket } from "onit-markets";

const submitBetFormSchema = z.object({
  amount: z.coerce.bigint(),
  firstSideScore: z.coerce.number().int().min(0),
  secondSideScore: z.coerce.number().int().min(0),
});

// Use the type from the schema
type MarketSideMetadata = z.infer<typeof scoreMarketSideMetadataSchema>;

export default function SubmitBetForm() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { marketAddress } = useParams<{ marketAddress: Address }>();
  const { data: market, error } = useMarket(marketAddress);
  const { data: marketParticipants } = useMarketParticipants(marketAddress);

  const form = useForm<z.infer<typeof submitBetFormSchema>>({
    resolver: zodResolver(submitBetFormSchema),
    // defaultValues: {
    //   amount: BigInt(0),
    //   firstSideScore: 0,
    //   secondSideScore: 0,
    // }
  });

  // Check if wallet is connected, if not, try to connect
  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [connectors, isConnected, connect]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Place Your Bet</h1>

      {market && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{market.questionTitle}</h2>
          <p className="text-gray-600 mb-4">{market.resolutionCriteria}</p>
        </div>
      )}

      {market && isScoreMarket(market) && (
        <ScoreBetForm form={form} market={market} />
      )}

      {/* Debug Data Section */}
      <div className="mt-10 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Debug Data</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Market Data</h3>
            <pre className="text-xs max-w-full overflow-x-scroll p-4 bg-gray-100 rounded-md">
              {JSON.stringify(market, bigIntReplacer, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Market Participants</h3>
            <pre className="text-xs max-w-full overflow-x-scroll p-4 bg-gray-100 rounded-md">
              {JSON.stringify(marketParticipants, bigIntReplacer, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBetForm({
  form,
  market,
}: {
  form: UseFormReturn<z.infer<typeof submitBetFormSchema>>;
  market: ScoreMarket;
}) {
  // Extract team metadata for display
  const metadata = market?.metadata || {};
  const firstSideMetadata: MarketSideMetadata =
    (metadata.firstSide as MarketSideMetadata) || {};
  const secondSideMetadata: MarketSideMetadata =
    (metadata.secondSide as MarketSideMetadata) || {};

  const firstSideName = firstSideMetadata.name || "Team 1";
  const secondSideName = secondSideMetadata.name || "Team 2";
  const firstSideImage = firstSideMetadata.image || "";
  const secondSideImage = secondSideMetadata.image || "";
  const firstSideDesc = firstSideMetadata.description || "";
  const secondSideDesc = secondSideMetadata.description || "";

  const amount = form.watch("amount");
  const firstSideScore = form.watch("firstSideScore");
  const secondSideScore = form.watch("secondSideScore");

  const {
    makeBet,
    isPending: isSubmittingBet,
    data: madeBetTxHash,
  } = useMakeBet({
    marketAddress: market.address,
    marketType: "score",
    bet: {
      score: `${firstSideScore}-${secondSideScore}`,
    },
    value: parseEther(amount.toString()).toString(),
    type: "calldata",
  });

  function onSubmit() {
    makeBet({
      onSuccess: (result) => {
        console.log("Bet placed successfully!", result);
        form.reset();
      },
      onError: (error) => {
        console.error("Error placing bet:", error);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-12 gap-8">
          {/* First Side */}
          <div className="col-span-6 space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">{firstSideName}</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={firstSideImage} alt={firstSideName} />
                <AvatarFallback className="text-xs">
                  {firstSideName?.[0] || "Team 1"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{firstSideName}</p>
                <p className="text-sm text-gray-500">{firstSideDesc}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="firstSideScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Predicted Score</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Second Side */}
          <div className="col-span-6 space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">{secondSideName}</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={secondSideImage} alt={secondSideName} />
                <AvatarFallback className="text-xs">
                  {secondSideName?.[0] || "T2"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{secondSideName}</p>
                <p className="text-sm text-gray-500">{secondSideDesc}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="secondSideScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Predicted Score</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Your Prediction</h3>

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center justify-center text-3xl font-bold mb-2">
              <span className="mx-3">{firstSideScore}</span>
              <span className="mx-2">-</span>
              <span className="mx-3">{secondSideScore}</span>
            </div>
            <div className="flex items-center justify-center text-sm">
              <span className="text-center w-24">{firstSideName}</span>
              <span className="mx-2 text-gray-400">vs</span>
              <span className="text-center w-24">{secondSideName}</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bet Amount (ETH)</FormLabel>
                <FormControl>
                  <Input
                    className="text-lg"
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    value={field.value?.toString() ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  The amount of ETH you want to bet on this prediction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-4 text-lg"
            disabled={isSubmittingBet}
          >
            {isSubmittingBet ? "Placing bet..." : "Submit Bet"}
          </Button>
        </div>
      </form>
      {!!madeBetTxHash && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Bet Placed Successfully!
          </h3>
          <pre className="mt-2 text-sm w-full rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white">
              {JSON.stringify(madeBetTxHash, bigIntReplacer, 2)}
            </code>
          </pre>
        </div>
      )}
    </Form>
  );
}
