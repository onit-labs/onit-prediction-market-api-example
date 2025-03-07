# Onit Prediction Market API Example

This repository demonstrates how to integrate with the [Onit Prediction Market API](https://markets.onit-labs.workers.dev/api/~/docs) to create and interact with prediction markets. The example includes a complete Next.js application showcasing market creation and betting functionality.

## Overview

The Onit Prediction Market API allows developers to:
- Create new prediction markets
- Fetch market data and participants
- Place bets on existing markets
- Resolve their markets and distribute winnings to bettors (coming soon)

This example application demonstrates these capabilities with a simple, user-friendly interface.

## Demo

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
- [Current Onit Markets](https://onit.fun)
