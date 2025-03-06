"use client";

import { toast } from "sonner";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createMarketFormSchema } from "@/lib/validators";
import { useCreateMarket } from "@/hooks/use-create-market";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bigIntReplacer } from "@/lib/utils";

export default function MarketForm() {
  const form = useForm<z.infer<typeof createMarketFormSchema>>({
    resolver: zodResolver(createMarketFormSchema),
  });

  const marketType = form.watch("marketType");

  const { mutate: createMarket, data: createdMarket } = useCreateMarket();

  console.log("createdMarket", createdMarket);

  function onSubmit(values: z.infer<typeof createMarketFormSchema>) {
    createMarket(values, {
      onError: (error) => {
        console.error(error);
        toast.error("Failed to create market");
      },
      onSettled: () => {
        toast(
          <pre className="mt-2 w-[340px] text-sm rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, bigIntReplacer, 2)}
            </code>
          </pre>
        );
      },
      onSuccess: () => {
        toast(
          <pre className="mt-2 w-[340px] text-sm rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, bigIntReplacer, 2)}
            </code>
          </pre>
        );
      },
    });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Question
                  <span className="text-sm font-semibold">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What will the score be for Liverpool vs Everton?"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the question the market will be deployed with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Market Type
                  <span className="text-sm font-semibold">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-1"
                    defaultValue={field.value}
                  >
                    {[
                      ["Spread Bet", "spread"],
                      ["Days Until", "days-until"],
                      // ["Other", "other"],
                    ].map((option, index) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={index}
                      >
                        <FormControl>
                          <RadioGroupItem value={option[1]} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option[0]}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resolutionCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Resolution Criteria
                  <span className="text-sm font-semibold">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="This market will resolve at 12.00PM when the score of the match
                is finalised by ..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the criteria that will be used to resolve the market.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bettingCutoff"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Betting Cutoff{" "}
                  {marketType === "spread" && (
                    <span className="text-sm font-semibold">*</span>
                  )}
                </FormLabel>
                <DatetimePicker
                  {...field}
                  value={new Date(Number(field.value))}
                  format={[
                    ["months", "days", "years"],
                    ["hours", "minutes", "am/pm"],
                  ]}
                />
                <FormDescription>
                  The date and time when the market should stop accepting bets.
                  {marketType === "spread" && (
                    <>
                      <br />
                      <span className="text-sm font-semibold text-red-500">
                        This field is required for spread bet markets.
                      </span>
                    </>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {marketType === "spread" && <SpreadMetadataForm form={form} />}

          <h2 className="text-lg font-bold">
            All markets must be started with an initial bet
          </h2>
          <div className="grid grid-cols-12 gap-4">
            {marketType === "spread" && (
              <>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="initialBet.firstSideScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Side Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0"
                            type="number"
                            min={0}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="initialBet.secondSideScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Second Side Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0"
                            type="number"
                            min={0}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {marketType === "days-until" && (
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="daysUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Until</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type="number"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      {!!createdMarket && (
        <>
          <pre className="mt-2 text-sm w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(createdMarket, bigIntReplacer, 2)}
            </code>
          </pre>
          <Link
            href={`/${createdMarket.data.marketAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500"
          >
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
              Show market
            </Button>
          </Link>
        </>
      )}
    </>
  );
}

function SpreadMetadataForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createMarketFormSchema>>;
}) {
  const firstSideImageUrl = form.watch("metadata.firstSide.image");
  const secondSideImageUrl = form.watch("metadata.secondSide.image");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mt-8">Market Side Metadata</h2>
      <div className="grid grid-cols-12 gap-8">
        {/* First Side Metadata */}
        <div className="col-span-6 space-y-4">
          <h3 className="text-md font-semibold">First Side</h3>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={firstSideImageUrl} alt="First side image" />
              <AvatarFallback className="text-xs">Image</AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-[196px]">
              <FormField
                control={form.control}
                name="metadata.firstSide.image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="metadata.firstSide.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
                  <span className="text-sm font-semibold">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Team/Option Name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metadata.firstSide.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional information about this side"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Second Side Metadata */}
        <div className="col-span-6 space-y-4">
          <h3 className="text-md font-semibold">Second Side</h3>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={secondSideImageUrl} alt="Second side image" />
              <AvatarFallback className="text-xs">Image</AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-[196px]">
              <FormField
                control={form.control}
                name="metadata.secondSide.image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="metadata.secondSide.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
                  <span className="text-sm font-semibold">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Team/Option Name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metadata.secondSide.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional information about this side"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
