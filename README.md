# Onit Prediction Market API Example

This repository demonstrates how to integrate with the [Onit Prediction Market API](https://markets.onit-labs.workers.dev/api/~/docs) using the [`onit-markets`](https://www.npmjs.com/package/onit-markets) npm package to create and interact with prediction markets. The example includes a complete Next.js application showcasing market creation and betting functionality.

## Overview

The [API](https://markets.onit-labs.workers.dev/api/~/docs) allows developers to:
- Create new prediction markets
- Fetch market data and participants
- Place bets on existing markets
- Resolve their markets and distribute winnings to bettors (coming soon)

The [package](https://www.npmjs.com/package/onit-markets) provides a type safe client for interacting with this API.

## Demo

### Setup

See the [app/client.ts](./app/client.ts) file for how to initialize the client with your API endpoint that should proxy requests to the Onit API (to protect your API key)
```typescript
/// app/client.ts
import { getClient } from 'onit-markets';

const client = getClient('http://localhost:3001/proxy');

export default client;
```

See the [app/proxy/[...catchall]/route.ts](./app/proxy/[...catchall]/route.ts) file for how to create a proxy route to proxy requests to the Onit API (to protect your API key)
```typescript
/// app/proxy/[...catchall]/route.ts
async function proxyRequest(request: NextRequest) {
   
   const headers = {
      // ... additional headers here
      Authorization: "Bearer " + ONIT_API_KEY,
   } as Record<string, string>;

  // ...
   ```

### Application Pages
The application includes two main pages:

1. **[Market Creation Page](./app/page.tsx)**
   - Form to create new prediction markets
   - Collects market type, details, and metadata
   - Submits to Onit API to create the market on-chain

2. **[Betting Page](./app/[marketAddress]/page.tsx)**
   - Displays a specific market by its address
   - Provides a form for users to place bets
   - Connects to user's wallet to execute betting transactions

## Hooks

The application uses custom React hooks to interact with the Onit API:

1. **[useCreateMarket](./hooks/use-create-market.ts)**
   - Creates a new prediction market via the Onit API

2. **[useMarket](./hooks/use-market.ts)**
   - Fetches data for a specific market

3. **[useMakeBet](./hooks/use-make-bet.ts)**
   - Places a bet on a market
   - Handles transaction submission to the blockchain

4. **[useGetBetCalldata](./hooks/use-get-bet-calldata.ts)**
   - Generates calldata needed for betting transactions
   - Used internally by useMakeBet

5. **[useMarketParticipants](./hooks/use-market-participants.ts)**
   - Fetches participants data for a specific market

## Getting Started

### Prerequisites

- An Onit API key
- Node.js 18+ or Bun
- A Web3 wallet (e.g., MetaMask)

### Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and add your Onit API key:
   ```
   ONIT_API_KEY=your_api_key
   ONIT_API_URL=https://markets.onit-labs.workers.dev/api
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Additional Resources

- [Onit API Documentation](https://markets.onit-labs.workers.dev/api/~/docs)
- [`onit-markets` npm package](https://www.npmjs.com/package/onit-markets)
- [Current Onit Markets](https://onit.fun)
