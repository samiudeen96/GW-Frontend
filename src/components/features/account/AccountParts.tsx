/** Small presentational pieces shared by the account portal tabs. */
import type { AccountAddress } from "@/lib/api/account";
import { useI18n } from "@/lib/i18n/react";

export function AvatarBlock({
  url,
  fallback,
  size = "lg",
}: {
  url: string | null;
  fallback: string;
  size?: "lg" | "sm";
}) {
  const dim = size === "lg" ? "h-20 w-20 md:h-24 md:w-24" : "h-14 w-14";
  return (
    <div className={`${dim} shrink-0 overflow-hidden border hairline bg-moss/[0.06]`}>
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center font-serif text-2xl text-forest">
          {fallback}
        </div>
      )}
    </div>
  );
}

export function SkeletonBlock() {
  return (
    <div className="space-y-px bg-ink/[0.08]">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse bg-moss/[0.04]" />
      ))}
    </div>
  );
}

export function SectionTitle({ children, note }: { children: string; note?: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4 border-b hairline pb-3">
      <h2 className="text-xs font-bold tracking-[0.2em] uppercase">{children}</h2>
      {note && (
        <span className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          {note}
        </span>
      )}
    </div>
  );
}

export function Metric({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`${accent ? "bg-moss/[0.08]" : "bg-paper"} min-h-[130px] border-e border-b hairline p-5 md:p-6`}
    >
      <p className="mb-3 text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <p className="font-serif text-xl break-words md:text-2xl">{value}</p>
      {sub && (
        <p className="mt-2 text-[9px] tracking-[0.14em] text-muted-foreground uppercase">{sub}</p>
      )}
    </div>
  );
}

export function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-4 ${bold ? "font-semibold" : "text-muted-foreground"}`}
    >
      <span className="text-[10px] tracking-[0.16em] uppercase">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-5">
      <p className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <p className="text-sm break-words">{value}</p>
    </div>
  );
}

export function AddressLines({ a }: { a: Partial<AccountAddress> }) {
  const { t } = useI18n();
  const lines = [
    a.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.zip].filter(Boolean).join(", "),
    a.country,
    a.phone,
  ].filter((l): l is string => typeof l === "string" && l.trim().length > 0);
  if (lines.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        {t("commerce.account.noAddress", "No address recorded.")}
      </p>
    );
  return (
    <div className="space-y-1 text-xs">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  ctaLabel,
  to,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  to: string;
}) {
  const { path } = useI18n();
  return (
    <div className="border hairline p-8 text-center">
      <h3 className="mb-2 font-serif text-xl">{title}</h3>
      <p className="mx-auto mb-6 max-w-sm text-xs text-muted-foreground">{body}</p>
      <a
        href={path(to)}
        className="inline-flex bg-forest px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-paper uppercase"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
