/**
 * Module: Customer Account portal
 *
 * Purpose: signed-in shopper workspace — lifetime overview, full order history
 * with line items, derived address book, profile details and security controls.
 * Users: customers.
 * Integration points: src/lib/account.functions.ts (orders + addresses),
 * Lovable Cloud auth (OTP / password), /track-order.
 */

import { useMemo, useState } from "react";
import { TrackingPanel } from "@/components/site/TrackingPanel";
import { abs } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EmailOtpSignIn } from "@/components/site/EmailOtpSignIn";
import { useSession } from "@/lib/use-session";
import { getMyAccount, type AccountOrder, type AccountAddress } from "@/lib/account.functions";
import { useT } from "@/lib/i18n";
import {
  useProfile,
  initials,
  displayName,
  fileToAvatarDataUrl,
  type CustomerProfile,
} from "@/lib/use-profile";
import { uploadMyAvatar } from "@/lib/profile.functions";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Green Wealth" },
      {
        name: "description",
        content:
          "Your Green Wealth account: order history, shipment status, saved addresses, profile details and sign-in security.",
      },
      { property: "og:title", content: "My Account — Green Wealth" },
      {
        property: "og:description",
        content: "Review Green Wealth orders, shipment progress, saved addresses and account security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: abs("/account") }],
  }),
  component: AccountPage,
});

const TABS = ["Overview", "Orders", "Addresses", "Profile", "Security"] as const;
type Tab = (typeof TABS)[number];

const TAB_KEY: Record<Tab, string> = {
  Overview: "commerce.account.tab.overview",
  Orders: "commerce.account.tab.orders",
  Addresses: "commerce.account.tab.addresses",
  Profile: "commerce.account.tab.profile",
  Security: "commerce.account.tab.security",
};

function money(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(
      cents / 100,
    );
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}

function dateLabel(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* Internal ERP/routing states are never shown to customers — they are folded
   into plain-language shopper statuses. */
const CUSTOMER_STATUS: Record<string, { label: string; key: string; tone: string }> = {
  received: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  routed: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  synced: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  sync_failed: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  unroutable: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  confirmed: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  paid: { label: "Confirmed", key: "confirmed", tone: "text-forest" },
  processing: { label: "Processing", key: "processing", tone: "text-muted-foreground" },
  packed: { label: "Processing", key: "processing", tone: "text-muted-foreground" },
  shipped: { label: "Shipped", key: "shipped", tone: "text-forest" },
  in_transit: { label: "Shipped", key: "shipped", tone: "text-forest" },
  out_for_delivery: { label: "Out for delivery", key: "outForDelivery", tone: "text-forest" },
  fulfilled: { label: "Delivered", key: "delivered", tone: "text-forest" },
  delivered: { label: "Delivered", key: "delivered", tone: "text-forest" },
  completed: { label: "Delivered", key: "delivered", tone: "text-forest" },
  cancelled: { label: "Cancelled", key: "cancelled", tone: "text-destructive" },
  canceled: { label: "Cancelled", key: "cancelled", tone: "text-destructive" },
  refunded: { label: "Refunded", key: "refunded", tone: "text-destructive" },
};

function customerStatus(raw: string) {
  return (
    CUSTOMER_STATUS[raw.trim().toLowerCase()] ?? {
      label: "Processing",
      key: "processing",
      tone: "text-muted-foreground",
    }
  );
}

function useStatusLabel() {
  const t = useT();
  return (raw: string) => {
    const s = customerStatus(raw);
    return t(`commerce.account.status.${s.key}`, s.label);
  };
}

const LABEL_TO_KEY: Record<string, string> = {
  Confirmed: "confirmed",
  Processing: "processing",
  Shipped: "shipped",
  "Out for delivery": "outForDelivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Refunded: "refunded",
};

function useStatusLabelFromLabel() {
  const t = useT();
  return (label: string) => t(`commerce.account.status.${LABEL_TO_KEY[label] ?? "processing"}`, label);
}


function AccountPage() {
  const t = useT();
  const { user, loading, signOut } = useSession();

  return (
    <>
      <div className="bg-forest text-paper border-b border-paper/15">
        <div className="container-editorial py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-brass mb-4">
                {t("commerce.account.portal.eyebrow", "Private Customer Record")}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl leading-none">
                {t("commerce.account.portal.title", "My Account")}
              </h1>
              <p className="text-sm text-paper/70 max-w-2xl mt-4 leading-relaxed">
                {t(
                  "commerce.account.portal.intro",
                  "One place for every order, delivery, address and account setting.",
                )}
              </p>
            </div>
            <div className="grid grid-cols-3 border border-paper/20 divide-x divide-paper/20 min-w-full md:min-w-[390px]">
              {["Orders", "Delivery", "Security"].map((label, index) => (
                <div key={label} className="p-4 md:p-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-paper/55">0{index + 1}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] mt-2">{t(`commerce.account.header.${label.toLowerCase()}`, label)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-editorial py-6 md:py-10">
        {loading ? (
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground text-center">
            {t("commerce.account.checkingSession", "Checking session…")}
          </p>
        ) : user ? (
          <SignedIn email={user.email} onSignOut={() => void signOut()} />
        ) : (
          <SignedOut />
        )}
      </div>
    </>
  );
}

function SignedOut() {
  const t = useT();
  return (
    <div className="max-w-3xl mx-auto">
      <div className="border hairline p-8 md:p-12 bg-paper">
        <div className="max-w-sm mx-auto">
          <h2 className="font-serif text-2xl mb-2 text-center">{t("commerce.account.signIn.title", "Sign in")}</h2>
          <p className="text-xs text-muted-foreground text-center mb-6">
            {t("commerce.account.signIn.subtitle", "Choose an emailed 6-digit code or your password.")}
          </p>
          <EmailOtpSignIn />
        </div>
      </div>
      <div className="border hairline p-6 md:p-8 bg-paper mt-6 text-center">
        <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-2">
          {t("commerce.account.lookup.title", "Order lookup without signing in")}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {t("commerce.account.lookup.body", "Use your order number with the email or phone from checkout.")}
        </p>
        <Link to="/track-order" className="text-xs uppercase tracking-[0.18em] font-semibold underline">
          {t("commerce.account.lookup.cta", "Go to order tracking")}
        </Link>
      </div>
    </div>
  );
}

function AvatarBlock({
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
    <div className={`${dim} shrink-0 border hairline bg-moss/[0.06] overflow-hidden`}>
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full grid place-items-center font-serif text-2xl text-forest">
          {fallback}
        </div>
      )}
    </div>
  );
}

function SignedIn({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const t = useT();
  const [tab, setTab] = useState<Tab>("Overview");
  const fetchAccount = useServerFn(getMyAccount);
  const { profile, loading: profileLoading, save } = useProfile();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-account", email],
    queryFn: () => fetchAccount(),
    staleTime: 60_000,
  });

  const orders = data?.orders ?? [];
  const addresses = data?.addresses ?? [];
  const name = displayName(profile, email);
  const lifetime = data?.stats.lifetimeByCurrency ?? [];
  const statusLabel = useStatusLabel();
  const activeOrder = orders.find((order) => !["delivered", "completed", "fulfilled", "cancelled", "canceled", "refunded"].includes(order.status.toLowerCase()));
  const latestOrder = activeOrder ?? orders[0];

  return (
    <div className="border hairline bg-paper min-h-[720px] grid grid-cols-1 lg:grid-cols-[250px_1fr]">
      <aside className="bg-forest text-paper p-5 md:p-7 flex flex-col lg:min-h-[720px]">
        <div className="flex items-center gap-4 pb-6 border-b border-paper/15">
          <AvatarBlock url={profile.avatarUrl} fallback={initials(profile, email)} size="sm" />
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.2em] text-brass mb-1">{t("commerce.account.signedIn", "Signed in")}</p>
            <p className="font-serif text-xl break-words leading-tight">{profileLoading ? "…" : name}</p>
            <p className="text-[10px] text-paper/55 truncate mt-1">{email ?? "—"}</p>
          </div>
        </div>

        <nav className="grid grid-cols-3 lg:flex lg:flex-col py-4 lg:py-6" aria-label={t("commerce.account.sectionNav", "Account sections") }>
          {TABS.map((tabName, index) => (
            <Button
              key={tabName}
              type="button"
              variant="ghost"
              onClick={() => setTab(tabName)}
              className={`h-auto min-w-0 justify-start rounded-none border-b px-3 py-3.5 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] ${
                tab === tabName ? "border-brass bg-paper/10 text-paper" : "border-paper/10 text-paper/60 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <span className="text-brass/65">0{index + 1}</span>
              {t(TAB_KEY[tabName], tabName)}
            </Button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-paper/15 grid grid-cols-2 lg:grid-cols-1 gap-2">
          <Button asChild variant="ghost" className="rounded-none justify-start text-[10px] uppercase tracking-[0.18em] text-paper hover:bg-paper/10 hover:text-paper">
            <Link to="/track-order">{t("commerce.account.trackOrder", "Track an order")}</Link>
          </Button>
          <Button type="button" variant="ghost" onClick={onSignOut} className="rounded-none justify-start text-[10px] uppercase tracking-[0.18em] text-paper/60 hover:bg-paper/10 hover:text-paper">
            {t("commerce.account.signOut", "Sign out")}
          </Button>
        </div>
      </aside>

      <main className="bg-paper min-w-0">
        <div className="border-b hairline p-5 md:p-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("commerce.account.workspace", "Account workspace")}</p>
            <h2 className="font-serif text-3xl md:text-4xl">{t(TAB_KEY[tab], tab)}</h2>
            <p className="text-xs text-muted-foreground mt-2">{t("commerce.account.updated", "Updated from your latest Green Wealth records")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!profileLoading && !profile.firstName && (
              <Button type="button" variant="outline" onClick={() => setTab("Profile")} className="rounded-none text-[10px] uppercase tracking-[0.16em]">
                {t("commerce.account.completeProfile", "Complete profile")}
              </Button>
            )}
            <Button asChild className="rounded-none text-[10px] uppercase tracking-[0.16em]">
              <Link to="/shop">{t("commerce.account.shopAgain", "Shop again")}</Link>
            </Button>
          </div>
        </div>

        {tab === "Overview" && !isLoading && !isError && (
          <div className="grid grid-cols-2 xl:grid-cols-4 border-b hairline">
            <Metric label={t("commerce.account.metric.orders", "Orders")} value={String(data?.stats.orderCount ?? 0)} sub={t("commerce.account.metric.orderRecord", "Complete record")} />
            <Metric label={t("commerce.account.metric.lifetimeValue", "Lifetime value")} value={lifetime.length ? money(lifetime[0]!.totalCents, lifetime[0]!.currency) : "—"} sub={lifetime.length > 1 ? `+ ${lifetime.length - 1} ${t("commerce.account.moreCurrencySuffix", "more currency")}` : t("commerce.account.metric.recordedSpend", "Recorded spend")} accent />
            <Metric label={t("commerce.account.metric.delivery", "Latest delivery")} value={latestOrder ? statusLabel(latestOrder.status) : "—"} sub={latestOrder ? latestOrder.orderNumber : t("commerce.account.metric.noOrder", "No order yet")} />
            <Metric label={t("commerce.account.metric.customerSince", "Customer since")} value={dateLabel(data?.stats.firstOrderAt ?? null)} sub={`${addresses.length} ${t("commerce.account.metric.addressesOnFile", "addresses on file")}`} />
          </div>
        )}

        <section className="p-5 md:p-8 min-w-0">
        {isLoading ? (
          <SkeletonBlock />
        ) : isError ? (
          <div className="border border-destructive bg-destructive/5 p-6">
            <p className="text-xs text-destructive font-semibold mb-3">
              {t("commerce.account.loadError", "We could not load your account data.")}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="border hairline px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold"
            >
              {t("commerce.account.retry", "Retry")}
            </button>
          </div>
        ) : (
          <>
            {tab === "Overview" && (
              <OverviewTab
                stats={data?.stats}
                orders={orders}
                onSeeOrders={() => setTab("Orders")}
              />
            )}
            {tab === "Orders" && <OrdersTab orders={orders} />}
            {tab === "Addresses" && <AddressesTab addresses={addresses} />}
            {tab === "Profile" && (
              <ProfileTab
                email={email}
                stats={data?.stats}
                profile={profile}
                onSave={save}
                addressCount={addresses.length}
                latestAddressName={orders[0]?.shippingAddress.name ?? null}
              />
            )}
            {tab === "Security" && <SecurityTab />}
          </>
        )}
        </section>
      </main>
    </div>
  );
}


function SkeletonBlock() {
  return (
    <div className="space-y-px bg-ink/[0.08]">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-moss/[0.04] animate-pulse" />
      ))}
    </div>
  );
}

function SectionTitle({ children, note }: { children: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-6 border-b hairline pb-3">
      <h2 className="text-xs uppercase tracking-[0.2em] font-bold">{children}</h2>
      {note && <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{note}</span>}
    </div>
  );
}

function OverviewTab({
  stats,
  orders,
  onSeeOrders,
}: {
  stats: { orderCount: number; lifetimeByCurrency: { currency: string; totalCents: number }[]; firstOrderAt: string | null; lastOrderAt: string | null } | undefined;
  orders: AccountOrder[];
  onSeeOrders: () => void;
}) {
  const t = useT();
  const recent = orders.slice(0, 3);

  return (
    <div>
      <SectionTitle note={orders.length ? t("commerce.account.mostRecent", "Most recent") : undefined}>
        {t("commerce.account.recentOrders", "Recent orders")}
      </SectionTitle>
      {recent.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.ordersTitle", "No orders yet")}
          body={t(
            "commerce.account.empty.ordersBodyOverview",
            "When you place an order it will appear here with full line items and shipment status.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <>
          <div className="space-y-px bg-ink/[0.08] border hairline">
            {recent.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
          {orders.length > recent.length && (
            <button
              type="button"
              onClick={onSeeOrders}
              className="mt-6 border hairline px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold"
            >
              {t("commerce.account.viewAllOrders", "View all")} {orders.length} {t("commerce.account.ordersWord", "orders")}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Metric({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`${accent ? "bg-moss/[0.08]" : "bg-paper"} p-5 md:p-6 border-e border-b hairline min-h-[130px]`}>
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{label}</p>
      <p className="font-serif text-xl md:text-2xl break-words">{value}</p>
      {sub && <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mt-2">{sub}</p>}
    </div>
  );
}

function OrdersTab({ orders }: { orders: AccountOrder[] }) {
  const t = useT();
  const statusLabel = useStatusLabelFromLabel();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(orders.map((o) => customerStatus(o.status).label)))],
    [orders],
  );

  const filtered = orders.filter((o) => {
    const matchesStatus = status === "all" || customerStatus(o.status).label === status;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div>
      <SectionTitle note={`${filtered.length} ${t("commerce.account.of", "of")} ${orders.length}`}>
        {t("commerce.account.orderHistory", "Order history")}
      </SectionTitle>

      {orders.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.ordersTitle", "No orders yet")}
          body={t(
            "commerce.account.empty.ordersBody",
            "Orders placed with this email — including earlier greenwealth.com purchases — appear here automatically.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-px bg-ink/[0.08] border hairline mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("commerce.account.searchPlaceholder", "Search order number or product")}
              className="bg-paper px-4 py-3 text-base outline-none focus:bg-moss/[0.04]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-paper px-4 py-3 text-xs uppercase tracking-[0.16em] font-semibold outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? t("commerce.account.allStatuses", "All statuses") : statusLabel(s)}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground uppercase tracking-[0.16em]">
              {t("commerce.account.noMatch", "No orders match this filter.")}
            </p>
          ) : (
            <div className="space-y-px bg-ink/[0.08] border hairline">
              {filtered.map((o) => (
                <OrderRow key={o.id} order={o} expandable />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ order, expandable = false }: { order: AccountOrder; expandable?: boolean }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { label: rawStatusLabel, tone } = customerStatus(order.status);
  const statusLabel = useStatusLabelFromLabel()(rawStatusLabel);

  return (
    <div className="bg-paper group hover:bg-moss/[0.035] transition-colors">
      <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border-s-2 border-transparent group-hover:border-gold transition-colors">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-xs uppercase tracking-[0.18em] font-bold">{order.orderNumber}</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {dateLabel(order.createdAt)}
            </p>
            <p className={`text-[10px] uppercase tracking-[0.16em] font-semibold border-s-2 border-current ps-2 ${tone}`}>{statusLabel}</p>
            {order.source === "legacy" && (
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground border hairline px-2 py-0.5">
                {t("commerce.account.archive", "Archive")}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {order.items.length > 0
              ? order.items.map((i) => `${i.quantity} × ${i.name}`).join("  ·  ")
              : t("commerce.account.lineItemsUnavailable", "Line items unavailable")}
          </p>
        </div>
        <div className="flex items-center gap-5 md:justify-end">
          <p className="font-serif text-lg whitespace-nowrap">
            {money(order.grandTotalCents, order.currency)}
          </p>
          {expandable && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="border hairline px-3 py-2 text-[11px] uppercase tracking-[0.16em] font-semibold"
            >
              {open ? t("commerce.account.close", "Close") : t("commerce.account.details", "Details")}
            </button>
          )}
        </div>
      </div>

      {expandable && open && (
        <div className="border-t hairline grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/[0.08]">
          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("commerce.trackOrder.items", "Items")}</p>
            <div className="space-y-2">
              {order.items.length === 0 && (
                <p className="text-xs text-muted-foreground">{t("commerce.account.noLineItems", "No line items recorded.")}</p>
              )}
              {order.items.map((i, idx) => (
                <div key={`${i.name}-${idx}`} className="flex justify-between gap-4 text-xs">
                  <span className="min-w-0">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="whitespace-nowrap">{money(i.lineTotalCents, order.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t hairline space-y-1 text-xs">
              <Line label={t("commerce.trackOrder.items", "Items")} value={money(order.itemsTotalCents, order.currency)} />
              <Line label={t("commerce.summary.shipping", "Shipping")} value={money(order.shippingTotalCents, order.currency)} />
              <Line label={t("commerce.summary.total", "Total")} value={money(order.grandTotalCents, order.currency)} bold />
            </div>
          </div>
          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {t("commerce.account.shippingAddress", "Shipping address")}
            </p>
            <AddressLines a={order.shippingAddress} />
            <div className="mt-5 pt-5 border-t hairline">
              <TrackingPanel tracking={order.tracking} status={order.status} compact />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-5 mb-2">
              {t("commerce.trackOrder.payment", "Payment")}
            </p>
            <p className="text-xs">
              {(order.paymentMethod ?? "—").toUpperCase()}
              {order.paymentStatus ? ` · ${order.paymentStatus.replace(/_/g, " ")}` : ""}
            </p>
            <Link
              to="/track-order"
              className="inline-flex mt-5 bg-forest text-paper px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold"
            >
              {t("commerce.account.trackThisOrder", "Track this order")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${bold ? "font-semibold" : "text-muted-foreground"}`}>
      <span className="uppercase tracking-[0.16em] text-[10px]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AddressLines({ a }: { a: Partial<AccountAddress> }) {
  const t = useT();
  const lines = [a.name, a.line1, a.line2, [a.city, a.state, a.zip].filter(Boolean).join(", "), a.country, a.phone].filter(
    (l) => typeof l === "string" && l.trim().length > 0,
  );
  if (lines.length === 0) return <p className="text-xs text-muted-foreground">{t("commerce.account.noAddress", "No address recorded.")}</p>;
  return (
    <div className="text-xs space-y-1">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}

function AddressesTab({ addresses }: { addresses: AccountAddress[] }) {
  const t = useT();
  return (
    <div>
      <SectionTitle note={`${addresses.length} ${t("commerce.account.onFile", "on file")}`}>
        {t("commerce.account.addressBook", "Address book")}
      </SectionTitle>
      {addresses.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.addressesTitle", "No addresses yet")}
          body={t(
            "commerce.account.empty.addressesBody",
            "Addresses are saved automatically from your orders, so your next checkout is faster.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/[0.08] border hairline">
          {addresses.map((a, idx) => (
            <div key={a.id} className="bg-paper p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {idx === 0
                    ? t("commerce.account.defaultMostRecent", "Default · most recent")
                    : t("commerce.account.previous", "Previous")}
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("commerce.account.used", "Used")} {a.usedCount}×
                </p>
              </div>
              <AddressLines a={a} />
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-4">
                {t("commerce.account.lastUsed", "Last used")} {dateLabel(a.lastUsedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-muted-foreground mt-6">
        {t(
          "commerce.account.addressNote",
          "To add or change an address, enter it at checkout — it is stored with the order and appears here.",
        )}
      </p>
    </div>
  );
}

function ProfileTab({
  email,
  stats,
  profile,
  onSave,
  addressCount,
  latestAddressName,
}: {
  email: string | null;
  stats: { orderCount: number; firstOrderAt: string | null; lastOrderAt: string | null } | undefined;
  profile: CustomerProfile;
  onSave: (next: Partial<CustomerProfile>) => Promise<void>;
  addressCount: number;
  latestAddressName: string | null;
}) {
  const t = useT();
  const upload = useServerFn(uploadMyAvatar);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const suggestion = (() => {
    if (firstName || lastName || !latestAddressName) return null;
    return latestAddressName;
  })();

  const saveDetails = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await onSave({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      setMsg({ kind: "ok", text: t("commerce.account.profileSaved", "Profile updated.") });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Could not save." });
    } finally {
      setBusy(false);
    }
  };

  const pickAvatar = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      const { url } = await upload({ data: { dataUrl } });
      await onSave({ avatarUrl: url });
      setMsg({ kind: "ok", text: t("commerce.account.photoSaved", "Profile photo updated.") });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Could not upload image." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <SectionTitle note={email ?? undefined}>{t("commerce.account.profile", "Profile")}</SectionTitle>

      <div className="border hairline bg-paper p-6 flex flex-col sm:flex-row items-start gap-6 mb-px">
        <AvatarBlock url={profile.avatarUrl} fallback={initials(profile, email)} />
        <div className="min-w-0">
          <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-2">
            {t("commerce.account.profilePhoto", "Profile photo")}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-sm">
            {t(
              "commerce.account.profilePhotoBody",
              "JPG, PNG or WebP up to 2 MB. Your photo is private to your account and never shown publicly.",
            )}
          </p>
          <label className="inline-flex border hairline px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold cursor-pointer">
            {profile.avatarUrl
              ? t("commerce.account.replacePhoto", "Replace photo")
              : t("commerce.account.uploadPhoto", "Upload photo")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={busy}
              onChange={(e) => void pickAvatar(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <div className="border hairline bg-paper p-6 mb-6">
        <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-4">
          {t("commerce.account.personalDetails", "Personal details")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <LabeledInput
            label={t("commerce.account.firstName", "First name")}
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
          />
          <LabeledInput
            label={t("commerce.account.lastName", "Last name")}
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
          />
          <LabeledInput
            label={t("commerce.account.phone", "Phone")}
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {t("commerce.trackOrder.email", "Email")}
            </p>
            <p className="border hairline bg-moss/[0.04] px-3 py-3 text-sm break-words">{email ?? "—"}</p>
          </div>
        </div>
        {suggestion && (
          <button
            type="button"
            onClick={() => {
              const [f = "", ...r] = suggestion.split(/\s+/);
              setFirstName(f);
              setLastName(r.join(" "));
            }}
            className="mt-4 text-[11px] uppercase tracking-[0.16em] font-semibold underline"
          >
            {t("commerce.account.useOrderName", "Use name from last order")} · {suggestion}
          </button>
        )}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => void saveDetails()}
            disabled={busy}
            className="bg-forest text-paper px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold disabled:opacity-50"
          >
            {busy ? t("commerce.account.saving", "Saving…") : t("commerce.account.saveChanges", "Save changes")}
          </button>
          {msg && (
            <p
              className={`text-xs ${
                msg.kind === "ok" ? "text-muted-foreground" : "text-destructive font-semibold"
              }`}
            >
              {msg.text}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/[0.08] border hairline">
        <Field label={t("commerce.account.ordersPlaced", "Orders placed")} value={String(stats?.orderCount ?? 0)} />
        <Field label={t("commerce.account.metric.savedAddresses", "Saved addresses")} value={String(addressCount)} />
        <Field label={t("commerce.account.firstOrder", "First order")} value={dateLabel(stats?.firstOrderAt ?? null)} />
        <Field label={t("commerce.account.latestOrder", "Latest order")} value={dateLabel(stats?.lastOrderAt ?? null)} />
      </div>

      <div className="border hairline p-6 mt-6">
        <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-2">{t("commerce.account.needChange", "Need a change?")}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {t(
            "commerce.account.needChangeBody",
            "Your email is your account identity. For name, phone or email changes, contact our team and we will update your record.",
          )}
        </p>
        <Link to="/contact" className="text-xs uppercase tracking-[0.18em] font-semibold underline">
          {t("commerce.payment.contactSupport", "Contact support")}
        </Link>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
      <input
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest"
      />
    </div>
  );
}


function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
      <p className="text-sm break-words">{value}</p>
    </div>
  );
}

function SecurityTab() {
  const t = useT();
  return (
    <div>
      <SectionTitle>{t("commerce.account.security", "Security")}</SectionTitle>
      <div className="border hairline p-6 mb-6">
        <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-2">{t("commerce.account.signInMethod", "Sign-in method")}</h3>
        <p className="text-xs text-muted-foreground">
          {t(
            "commerce.account.signInMethodBody",
            "You can always sign in with a 6-digit Green Wealth code emailed to you. Setting a password below adds a faster second option.",
          )}
        </p>
      </div>
      <PasswordBlock />
    </div>
  );
}

function EmptyState({
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
  return (
    <div className="border hairline p-8 text-center">
      <h3 className="font-serif text-xl mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">{body}</p>
      <Link
        to={to}
        className="inline-flex bg-forest text-paper px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

/** Lets a signed-in shopper set or replace their account password. */
function PasswordBlock() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const save = async () => {
    if (password.length < 8) {
      setMsg({ kind: "err", text: "Use at least 8 characters." });
      return;
    }
    if (password !== confirm) {
      setMsg({ kind: "err", text: "Passwords do not match." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setMsg({ kind: "err", text: error.message });
      else {
        setPassword("");
        setConfirm("");
        setMsg({ kind: "ok", text: "Password saved. You can now sign in with email and password." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border hairline p-6 max-w-sm">
      <h3 className="text-xs uppercase tracking-[0.18em] font-bold mb-1">Set a password</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Optional — keep using emailed codes, or set a password for faster sign in.
      </p>
      <div className="space-y-3">
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMsg(null);
          }}
          placeholder="New password"
          className="w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest"
        />
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setMsg(null);
          }}
          placeholder="Confirm password"
          className="w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="w-full bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save password"}
        </button>
        {msg && (
          <p
            className={`px-3 py-2 text-xs border ${
              msg.kind === "ok"
                ? "hairline bg-moss/5 text-muted-foreground"
                : "border-destructive bg-destructive/5 text-destructive font-semibold"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}
