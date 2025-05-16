/**
 * Logs an error and launches the debugger in development environment or throws an error in production
 * Useful in for situations that should never occur.
 *
 * @param {string} [msg] - An optional message describing the unexpected situation.
 * @param {...any} args - Additional arguments to log with the error message.
 * @throws {Error} Always throws an error with the message "This should never happen: {msg}".
 *
 * @example
 * const market = useAtomValue(marketAtom) || shouldNeverHappen("Unexpected value", someVariable);
 *
 * @example
 * const market = useAtomValue(marketAtom) || shouldNeverHappen("Unexpected value", someVariable);
 */
export const shouldNeverHappen = (msg?: string, ...args: unknown[]): never => {
  console.error(msg, ...args);

  if (process.env.NODE_ENV === "development") {
    // biome-ignore lint/suspicious/noDebugger: allow to use debugger in development
    debugger;
  }

  throw new Error(`This should never happen: ${msg}`);
};
