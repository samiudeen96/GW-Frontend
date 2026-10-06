/** Signed-in account workspace: sidebar navigation, metrics and the five tabs. */
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getMyAccount, type AccountOverview } from "@/lib/api/account";
import {
  EMPTY_PROFILE,
  getMyProfile,
  updateMyProfile,
  type CustomerProfile,
} from "@/lib/api/profile";
import { useI18n } from "@/lib/i18n/react";

import { CLOSED_STATUSES, dateLabel, money, statusLabel } from "./account-format";
import { AddressesTab } from "./AccountAddresses";
import { OrdersTab, OverviewTab } from "./AccountOrders";
import { AvatarBlock, Metric, SkeletonBlock } from "./AccountParts";
import { ProfileTab } from "./AccountProfile";
import { SecurityTab } from "./AccountSecurity";
import { displayName, initials } from "./profile-utils";

const TABS = ["Overview", "Orders", "Addresses", "Profile", "Security"] as const;
type Tab = (typeof TABS)[number];

const TAB_KEY: Record<Tab, string> = {
  Overview: "commerce.account.tab.overview",
  Orders: "commerce.account.tab.orders",
  Addresses: "commerce.account.tab.addresses",
  Profile: "commerce.account.tab.profile",
  Security: "commerce.account.tab.security",
};

/** Profile read/update. TODO(api): backed by placeholders in `@/lib/api/profile`. */
function useProfile() {
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((res) => {
        if (active && res.ok) setProfile(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback(
    async (next: Partial<CustomerProfile>) => {
      const merged = { ...profile, ...next };
      const res = await updateMyProfile(merged);
      if (!res.ok) throw new Error(res.error);
      setProfile(res.data);
    },
    [profile],
  );

  return { profile, loading, save };
}

type AccountState =
  { status: "loading" } | { status: "error" } | { status: "ready"; data: AccountOverview };

function useAccount(email: string | null) {
  const [state, setState] = useState<AccountState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    getMyAccount()
      .then((res) => {
        if (!active) return;
        setState(res.ok ? { status: "ready", data: res.data } : { status: "error" });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, [email, attempt]);

  return { state, refetch: () => setAttempt((n) => n + 1) };
}

export function AccountDashboard({
  email,
  onSignOut,
}: {
  email: string | null;
  onSignOut: () => void;
}) {
  const { t, path } = useI18n();
  const [tab, setTab] = useState<Tab>("Overview");
  const { profile, loading: profileLoading, save } = useProfile();
  const { state, refetch } = useAccount(email);

  const isLoading = state.status === "loading";
  const isError = state.status === "error";
  const data = state.status === "ready" ? state.data : undefined;
  const orders = data?.orders ?? [];
  const addresses = data?.addresses ?? [];
  const name = displayName(profile, email);
  const lifetime = data?.stats.lifetimeByCurrency ?? [];
  const activeOrder = orders.find((order) => !CLOSED_STATUSES.includes(order.status.toLowerCase()));
  const latestOrder = activeOrder ?? orders[0];

  return (
    <div className="grid min-h-[720px] grid-cols-1 border hairline bg-paper lg:grid-cols-[250px_1fr]">
      <aside className="flex flex-col bg-forest p-5 text-paper md:p-7 lg:min-h-[720px]">
        <div className="flex items-center gap-4 border-b border-paper/15 pb-6">
          <AvatarBlock url={profile.avatarUrl} fallback={initials(profile, email)} size="sm" />
          <div className="min-w-0">
            <p className="mb-1 text-[9px] tracking-[0.2em] text-brass uppercase">
              {t("commerce.account.signedIn", "Signed in")}
            </p>
            <p className="font-serif text-xl leading-tight break-words">
              {profileLoading ? "…" : name}
            </p>
            <p className="mt-1 truncate text-[10px] text-paper/55">{email ?? "—"}</p>
          </div>
        </div>

        <nav
          className="grid grid-cols-3 py-4 lg:flex lg:flex-col lg:py-6"
          aria-label={t("commerce.account.sectionNav", "Account sections")}
        >
          {TABS.map((tabName, index) => (
            <Button
              key={tabName}
              type="button"
              variant="ghost"
              onClick={() => setTab(tabName)}
              aria-current={tab === tabName ? "page" : undefined}
              className={`h-auto min-w-0 justify-start rounded-none border-b px-3 py-3.5 text-[9px] tracking-[0.14em] uppercase sm:text-[10px] sm:tracking-[0.18em] ${
                tab === tabName
                  ? "border-brass bg-paper/10 text-paper"
                  : "border-paper/10 text-paper/60 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <span className="text-brass/65">0{index + 1}</span>
              {t(TAB_KEY[tabName], tabName)}
            </Button>
          ))}
        </nav>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-paper/15 pt-4 lg:grid-cols-1">
          <Button
            asChild
            variant="ghost"
            className="justify-start rounded-none text-[10px] tracking-[0.18em] text-paper uppercase hover:bg-paper/10 hover:text-paper"
          >
            <a href={path("/track-order")}>{t("commerce.account.trackOrder", "Track an order")}</a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSignOut}
            className="justify-start rounded-none text-[10px] tracking-[0.18em] text-paper/60 uppercase hover:bg-paper/10 hover:text-paper"
          >
            {t("commerce.account.signOut", "Sign out")}
          </Button>
        </div>
      </aside>

      <div className="min-w-0 bg-paper">
        <div className="flex flex-col gap-5 border-b hairline p-5 md:p-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("commerce.account.workspace", "Account workspace")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">{t(TAB_KEY[tab], tab)}</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("commerce.account.updated", "Updated from your latest Green Wealth records")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!profileLoading && !profile.firstName && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setTab("Profile")}
                className="rounded-none text-[10px] tracking-[0.16em] uppercase"
              >
                {t("commerce.account.completeProfile", "Complete profile")}
              </Button>
            )}
            <Button asChild className="rounded-none text-[10px] tracking-[0.16em] uppercase">
              <a href={path("/shop")}>{t("commerce.account.shopAgain", "Shop again")}</a>
            </Button>
          </div>
        </div>

        {tab === "Overview" && data && (
          <div className="grid grid-cols-2 border-b hairline xl:grid-cols-4">
            <Metric
              label={t("commerce.account.metric.orders", "Orders")}
              value={String(data.stats.orderCount)}
              sub={t("commerce.account.metric.orderRecord", "Complete record")}
            />
            <Metric
              label={t("commerce.account.metric.lifetimeValue", "Lifetime value")}
              value={lifetime.length ? money(lifetime[0]!.totalCents, lifetime[0]!.currency) : "—"}
              sub={
                lifetime.length > 1
                  ? `+ ${lifetime.length - 1} ${t("commerce.account.moreCurrencySuffix", "more currency")}`
                  : t("commerce.account.metric.recordedSpend", "Recorded spend")
              }
              accent
            />
            <Metric
              label={t("commerce.account.metric.delivery", "Latest delivery")}
              value={latestOrder ? statusLabel(t, latestOrder.status) : "—"}
              sub={
                latestOrder
                  ? latestOrder.orderNumber
                  : t("commerce.account.metric.noOrder", "No order yet")
              }
            />
            <Metric
              label={t("commerce.account.metric.customerSince", "Customer since")}
              value={dateLabel(data.stats.firstOrderAt)}
              sub={`${addresses.length} ${t("commerce.account.metric.addressesOnFile", "addresses on file")}`}
            />
          </div>
        )}

        <section className="min-w-0 p-5 md:p-8">
          {isLoading ? (
            <SkeletonBlock />
          ) : isError ? (
            <div className="border border-destructive bg-destructive/5 p-6">
              <p className="mb-3 text-xs font-semibold text-destructive">
                {t("commerce.account.loadError", "We could not load your account data.")}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="border hairline px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {t("commerce.account.retry", "Retry")}
              </button>
            </div>
          ) : (
            <>
              {tab === "Overview" && (
                <OverviewTab orders={orders} onSeeOrders={() => setTab("Orders")} />
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
      </div>
    </div>
  );
}
