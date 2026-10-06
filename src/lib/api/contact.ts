/** Contact form (browser). TODO(api): POST {PUBLIC_API_URL}/contact. */
import type { ActionResult } from "./types";

export type ContactMessageInput = {
  firstName: string;
  lastName: string;
  email: string;
  /** English subject label, e.g. "Order Status". */
  subject: string;
  /** Only collected when the subject is "Order Status". */
  orderRef?: string;
  message: string;
};

export async function sendContactMessage(_input: ContactMessageInput): Promise<ActionResult> {
  return {
    ok: false,
    error:
      "The contact form is not connected yet. Please email support@greenwealth.com or message us on WhatsApp.",
  };
}
