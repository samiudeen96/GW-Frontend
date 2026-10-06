/** Footer newsletter sign-up. */
import { useState, type FormEvent } from "react";

import { subscribeNewsletter } from "@/lib/api/newsletter";

type Props = {
  labels: {
    email: string;
    join: string;
    joining: string;
    success: string;
    error: string;
  };
};

export default function NewsletterForm({ labels }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      await subscribeNewsletter({ email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : labels.error);
    }
  };

  if (status === "success") {
    return (
      <div className="border border-ivory/25 bg-ivory/5 px-4 py-3.5 text-sm text-ivory/90">
        {labels.success}
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex items-stretch border-b border-ivory/30 transition-colors focus-within:border-ivory"
      >
        <label htmlFor="footer-email" className="sr-only">
          {labels.email}
        </label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-ivory placeholder:text-ivory/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="ps-6 text-[11px] font-medium tracking-[0.22em] text-ivory/80 uppercase transition-colors hover:text-ivory disabled:opacity-60"
        >
          {status === "loading" ? labels.joining : `${labels.join} →`}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-xs text-ivory/70">{message}</p>}
    </div>
  );
}
