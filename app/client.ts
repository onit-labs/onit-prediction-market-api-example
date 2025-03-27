import { getClient } from "onit-markets";

// Initialize the client with your API endpoint which should proxy requests to the Onit API (to protect your API key)
const client = getClient("http://localhost:3001/proxy");

export const onitMarketsClient = client.api;
