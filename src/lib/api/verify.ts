/** Scratch-code verification (browser). TODO(api): POST {PUBLIC_API_URL}/verify. */
import type { VerifyResult } from "./types";

export async function verifySecretCode(_input: { code: string }): Promise<VerifyResult> {
  return {
    status: "error",
    message: "The verification service is not connected yet. Please try again later.",
    whatsapp: "https://api.whatsapp.com/send/?phone=97180044674",
  };
}
