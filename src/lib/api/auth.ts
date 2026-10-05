/**
 * Customer auth (browser). The backend owns sessions.
 * TODO(api): wire to the backend auth endpoints (email OTP + password).
 */
import type { ActionResult } from "./types";

const NOT_CONNECTED = { ok: false as const, error: "Sign-in is not connected yet." };

export async function requestEmailOtp(_input: { email: string }): Promise<ActionResult> {
  return NOT_CONNECTED;
}

export async function verifyEmailOtp(_input: {
  email: string;
  code: string;
}): Promise<ActionResult> {
  return NOT_CONNECTED;
}

export async function signInWithPassword(_input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  return NOT_CONNECTED;
}

export async function signOut(): Promise<void> {
  /* TODO(api): POST /auth/sign-out */
}
