const DEFAULT_TIMEOUT_MS = 10_000;

/** Bounded server-side fetch: provider or KV stalls must not consume the
 * entire serverless execution window. An existing caller signal is kept. */
export function fetchWithTimeout(
  input: string | URL | Request,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return globalThis.fetch(input, { ...init, signal });
}
