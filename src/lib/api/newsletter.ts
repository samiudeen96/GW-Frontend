/** Newsletter sign-up (browser). TODO(api): POST {PUBLIC_API_URL}/newsletter. */
import { NotConnectedError } from "./client";

export async function subscribeNewsletter(_input: { email: string }): Promise<void> {
  throw new NotConnectedError("Newsletter sign-up");
}
