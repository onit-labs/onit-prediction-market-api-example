import { defaultShouldDehydrateQuery } from "@tanstack/react-query";
import superjson from "superjson";

import { QueryClient } from "@tanstack/react-query";


let clientQueryClientSingleton: QueryClient;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}



export function getQueryClient() {
	// Server: always make a new query client
	if (typeof window === "undefined") return makeQueryClient();

	// Browser: use singleton pattern to keep the same query client
	// biome-ignore lint/suspicious/noAssignInExpressions: this is fine
	return (clientQueryClientSingleton ??= makeQueryClient());
}

