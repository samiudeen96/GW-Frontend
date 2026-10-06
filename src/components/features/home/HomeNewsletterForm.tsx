/** "The Lab Journal" sign-up form on the homepage. Labels arrive pre-translated. */
import { useState, type SubmitEvent } from "react";

import { subscribeNewsletter } from "@/lib/api/newsletter";

type Props = {
  labels: {
    email: string;
    placeholder: string;
    submit: string;
    success: string;
    error: string;
  };
};

export default function HomeNewsletterForm({ labels }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      await subscribeNewsletter({ email: email.trim() });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-brass/50 px-5 py-4 text-sm text-paper/85 sm:py-5" role="status">
        {labels.success}
      </div>
    );
  }

  return (
    <>
      <form className="flex border border-brass/50" onSubmit={onSubmit}>
        <label htmlFor="home-journal-email" className="sr-only">
          {labels.email}
        </label>
        <input
          id="home-journal-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          placeholder={labels.placeholder}
          className="min-w-0 flex-1 bg-transparent px-5 py-4 text-xs font-bold tracking-[0.18em] text-paper uppercase outline-none placeholder:text-paper/35 disabled:opacity-60 sm:py-5"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-brass px-6 py-4 text-[11px] font-bold tracking-[0.22em] text-forest uppercase transition-colors hover:bg-paper disabled:opacity-60 sm:px-10 sm:py-5"
        >
          {labels.submit}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-paper/70" role="alert">
          {labels.error}
        </p>
      )}
    </>
  );
}
