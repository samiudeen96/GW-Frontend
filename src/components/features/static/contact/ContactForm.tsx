/** Contact page message form: subject picker, conditional order reference, sent state. */
import { useState, type ReactNode, type SubmitEvent } from "react";

import { sendContactMessage } from "@/lib/api/contact";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";

type Props = {
  i18n: IslandI18n;
};

const SUBJECTS = [
  { key: "general", label: "General Inquiry" },
  { key: "orderStatus", label: "Order Status" },
  { key: "productInquiry", label: "Product Inquiry" },
  { key: "returns", label: "Returns & Exchange" },
  { key: "wholesale", label: "Distribution & Wholesale" },
  { key: "partnership", label: "Partnership Opportunity" },
  { key: "authenticity", label: "Authenticity Verification" },
  { key: "feedback", label: "Feedback" },
];

const inputCls =
  "w-full h-11 px-3 bg-paper border hairline text-sm text-ink focus:outline-none focus:ring-1 focus:ring-forest";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[10px] font-bold tracking-[0.15em] text-forest uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Form() {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genericError = t(
    "misc.contact.form.errorGeneric",
    "We could not send your message. Please try again.",
  );

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await sendContactMessage({
        firstName,
        lastName,
        email,
        subject,
        orderRef,
        message,
      });
      if (result.ok) setSent(true);
      else setError(result.error || genericError);
    } catch {
      setError(genericError);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="border hairline bg-ivory p-10 text-center">
        <h3 className="mb-3 font-serif text-2xl text-forest">
          {t("misc.contact.form.sentTitle", "Message sent")}
        </h3>
        <p className="mx-auto mb-6 max-w-sm text-sm text-ink/60">
          {t(
            "misc.contact.form.sentDescPrefix",
            "Our customer care team has your message and a confirmation is on its way to",
          )}{" "}
          {email}. {t("misc.contact.form.sentDescSuffix", "A human agent replies within 12 hours.")}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="inline-flex bg-forest px-6 py-3 text-[10px] font-semibold tracking-[0.2em] text-ivory uppercase"
        >
          {t("misc.contact.form.sendAnother", "Send another")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 border hairline bg-ivory p-6 md:p-8">
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("misc.contact.field.firstName", "First name")}>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t("misc.contact.field.lastName", "Last name")}>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>
      <Field label={t("misc.contact.field.email", "Email")}>
        <input
          required
          type="email"
          data-ltr
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label={t("misc.contact.field.subject", "Subject")}>
        <select
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputCls}
        >
          <option value="">{t("misc.contact.subject.placeholder", "Select a subject…")}</option>
          {SUBJECTS.map((s) => (
            <option key={s.key} value={s.label}>
              {t(`misc.contact.subject.${s.key}`, s.label)}
            </option>
          ))}
        </select>
      </Field>
      {subject === "Order Status" && (
        <Field label={t("misc.contact.field.orderRef", "Order reference")}>
          <input
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            placeholder={t("misc.contact.field.orderRefPlaceholder", "e.g. GW-24815")}
            data-ltr
            className={inputCls}
          />
        </Field>
      )}
      <Field label={t("misc.contact.field.message", "Message")}>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} min-h-32 resize-y`}
        />
      </Field>
      {error && (
        <p
          role="alert"
          className="border border-red-700/40 bg-red-50 px-4 py-3 text-xs text-red-800"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-forest px-6 py-4 text-[11px] font-semibold tracking-[0.2em] text-ivory uppercase transition hover:brightness-110 disabled:opacity-60"
      >
        {sending
          ? t("misc.contact.form.sending", "Sending…")
          : t("misc.contact.form.submit", "Send message")}
      </button>
    </form>
  );
}

export default function ContactForm({ i18n }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Form />
    </I18nProvider>
  );
}
