/**
 * Module: Backend RPC client
 *
 * Purpose: calls the standalone backend (`POST {VITE_API_URL}/rpc/<name>`) with
 * the same `fn({ data })` signature the old in-process server functions had,
 * attaching the shopper's Supabase bearer token when signed in.
 * Users: every `src/lib/*.functions.ts` stub.
 * Integration points: backend/src/index.ts, @/integrations/supabase/client.
 */

import type { ServerFn } from "@backend/rpc";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8787").replace(/\/$/, "");

/** Mirrors the backend builder: `P` is what callers may pass, `O` what they get. */
export type ClientFn<F> =
  F extends ServerFn<infer P, infer O>
    ? [P] extends [undefined]
      ? (opts?: { data?: undefined }) => Promise<O>
      : (opts: { data: P }) => Promise<O>
    : never;

async function bearerToken(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

export function rpc<F>(name: string): ClientFn<F> {
  const call = async (opts?: { data?: unknown }) => {
    const token = await bearerToken();
    const response = await fetch(`${API_URL}/rpc/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: opts?.data }),
    });

    const body = (await response.json().catch(() => null)) as {
      result?: unknown;
      error?: string;
    } | null;
    if (!response.ok) throw new Error(body?.error ?? `Request failed (${response.status})`);
    return body?.result;
  };
  return call as ClientFn<F>;
}
