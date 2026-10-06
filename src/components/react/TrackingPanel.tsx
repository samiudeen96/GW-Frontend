/**
 * Shipment stages + carrier details. Used inside islands; needs an
 * <I18nProvider> above it with the `commerce.tracking` prefix.
 */
import type { OrderTracking } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/react";
import { carrierLabel, hasTracking, trackingLink, trackingStages } from "@/lib/tracking";

function dayLabel(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

type Props = { tracking: OrderTracking; status: string; compact?: boolean };

export function TrackingPanel({ tracking, status, compact = false }: Props) {
  const { t } = useI18n();
  const stages = trackingStages(tracking, status);
  const link = trackingLink(tracking);
  const stageLabel: Record<string, string> = {
    confirmed: t("commerce.tracking.stage.confirmed", "Confirmed"),
    shipped: t("commerce.tracking.stage.shipped", "Shipped"),
    delivered: t("commerce.tracking.stage.delivered", "Delivered"),
  };
  const label = "uppercase tracking-[0.16em] text-[10px] text-muted-foreground";

  return (
    <div>
      <p className="mb-3 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {t("commerce.tracking.title", "Shipment tracking")}
      </p>

      <div className="grid grid-cols-3 gap-px border hairline bg-ink/[0.08]">
        {stages.map((s) => (
          <div key={s.key} className={`bg-paper px-3 py-3 ${s.done ? "" : "opacity-45"}`}>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase">
              {stageLabel[s.key] ?? s.label}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {s.done
                ? (dayLabel(s.at) ?? t("commerce.tracking.done", "Done"))
                : t("commerce.tracking.pending", "Pending")}
            </p>
          </div>
        ))}
      </div>

      {hasTracking(tracking) ? (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between gap-4 text-xs">
            <span className={label}>{t("commerce.tracking.carrier", "Carrier")}</span>
            <span className="font-semibold">
              {carrierLabel(tracking.trackingCarrier, t("commerce.tracking.courier", "Courier"))}
            </span>
          </div>
          {tracking.trackingNumber && (
            <div className="flex justify-between gap-4 text-xs">
              <span className={label}>
                {t("commerce.tracking.trackingNumber", "Tracking number")}
              </span>
              <span className="font-mono break-all" data-ltr>
                {tracking.trackingNumber}
              </span>
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex bg-forest px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-paper uppercase ${
                compact ? "" : "w-full justify-center"
              }`}
            >
              {t("commerce.tracking.trackShipment", "Track shipment")}
            </a>
          )}
        </div>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t(
            "commerce.tracking.noTracking",
            "Tracking details are added the moment your parcel is handed to the courier. You will receive an email with the carrier and tracking number.",
          )}
        </p>
      )}
    </div>
  );
}
