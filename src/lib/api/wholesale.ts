/** Wholesale application form (browser). TODO(api): POST {PUBLIC_API_URL}/wholesale. */
import type { ActionResult } from "./types";

export type WholesaleApplicationInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  tier: string;
  volume: string;
  channels: string;
  message: string;
};

export async function submitWholesaleApplication(
  _input: WholesaleApplicationInput,
): Promise<ActionResult> {
  // TODO(api): send the application to the backend once it is connected.
  return {
    ok: false,
    error: "The wholesale application is not connected yet. Please contact us on WhatsApp.",
  };
}
