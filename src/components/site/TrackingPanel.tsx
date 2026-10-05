import { carrierLabel, hasTracking, trackingLink, trackingStages, type OrderTracking } from "@shared/tracking";
import { useT } from "@/lib/i18n";

function dayLabel(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export function TrackingPanel({
  tracking,
  status,
  compact = false,
}: {
  tracking: OrderTracking;
  status: string;
  compact?: boolean;
}) {
  const t = useT();
  const stages = trackingStages(tracking, status);
  const link = trackingLink(tracking);
  const available = hasTracking(tracking);
  const stageLabel: Record<string, string> = {
    confirmed: t("commerce.tracking.stage.confirmed", "Confirmed"),
    shipped: t("commerce.tracking.stage.shipped", "Shipped"),
    delivered: t("commerce.tracking.stage.delivered", "Delivered"),
  };

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("commerce.tracking.title", "Shipment tracking")}</p>

      <div className="grid grid-cols-3 gap-px bg-ink/[0.08] border hairline">
        {stages.map((s) => (
          <div key={s.key} className={`bg-paper px-3 py-3 ${s.done ? "" : "opacity-45"}`}>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold">{stageLabel[s.key] ?? s.label}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
              {s.done ? (dayLabel(s.at) ?? t("commerce.tracking.done", "Done")) : t("commerce.tracking.pending", "Pending")}
            </p>
          </div>
        ))}
      </div>

      {available ? (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between gap-4 text-xs">
            <span className="uppercase tracking-[0.16em] text-[10px] text-muted-foreground">{t("commerce.tracking.carrier", "Carrier")}</span>
            <span className="font-semibold">{carrierLabel(tracking.trackingCarrier, t("commerce.tracking.courier", "Courier"))}</span>
          </div>
          {tracking.trackingNumber && (
            <div className="flex justify-between gap-4 text-xs">
              <span className="uppercase tracking-[0.16em] text-[10px] text-muted-foreground">
                {t("commerce.tracking.trackingNumber", "Tracking number")}
              </span>
              <span className="font-mono break-all" data-ltr>{tracking.trackingNumber}</span>
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex mt-3 bg-forest text-paper px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold ${
                compact ? "" : "w-full justify-center"
              }`}
            >
              {t("commerce.tracking.trackShipment", "Track shipment")}
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          {t(
            "commerce.tracking.noTracking",
            "Tracking details are added the moment your parcel is handed to the courier. You will receive an email with the carrier and tracking number.",
          )}
        </p>
      )}
    </div>
  );
}
