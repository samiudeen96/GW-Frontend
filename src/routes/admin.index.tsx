/**
 * Module: Admin overview (operations dashboard).
 *
 * Purpose: full-width command dashboard — trading KPIs, 30-day revenue series,
 * fulfilment funnel, revenue by currency, lifecycle mix, best sellers,
 * integration failures, latest website orders, email template review and the
 * greenwealth.com store mirror.
 * Users: Green Wealth owners / admins.
 * Integration points: src/lib/admin.functions.ts, src/lib/admin-orders.functions.ts.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AdminButton, Kpi, Panel, Sparkbars, StatusPill, money } from "@/components/admin/primitives";
import {
  getAdminOverview,
  getMirroredStore,
  resyncMirroredStore,
  sendEmailTemplatePreviews,
} from "@/lib/admin.functions";
import { adminOrderMetrics } from "@/lib/admin-orders.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Green Wealth" },
      { name: "description", content: "Operational snapshot of Green Wealth orders, catalogue, reviews and store mirror." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Overview — Green Wealth" },
      { property: "og:description", content: "Operational snapshot of Green Wealth orders and catalogue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminOverview,
});

type Overview = Awaited<ReturnType<typeof getAdminOverview>>;
type Mirror = Awaited<ReturnType<typeof getMirroredStore>>;
type Metrics = Awaited<ReturnType<typeof adminOrderMetrics>>;

function AdminOverview() {
  const loadOverview = useServerFn(getAdminOverview);
  const loadMirror = useServerFn(getMirroredStore);
  const loadMetrics = useServerFn(adminOrderMetrics);
  const runResync = useServerFn(resyncMirroredStore);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [mirror, setMirror] = useState<Mirror | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadOverview()
      .then((d) => !cancelled && setOverview(d))
      .catch(() => {});
    loadMirror()
      .then((d) => !cancelled && setMirror(d))
      .catch(() => {});
    loadMetrics()
      .then((d) => !cancelled && setMetrics(d))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loadOverview, loadMirror, loadMetrics]);

  async function handleResync() {
    setSyncing(true);
    try {
      await runResync();
      setMirror(await loadMirror());
    } finally {
      setSyncing(false);
    }
  }

  if (!overview) {
    return (
      <div className="container-admin py-24 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading console
      </div>
    );
  }

  const currencyRows = metrics
    ? Object.entries(metrics.revenueByCurrency).sort((a, b) => b[1] - a[1])
    : [];
  const statusRows = metrics ? Object.entries(metrics.statusCounts).sort((a, b) => b[1] - a[1]) : [];
  const statusTotal = statusRows.reduce((s, [, n]) => s + n, 0) || 1;

  return (
    <div className="container-admin py-6 space-y-px bg-ink/[0.06]">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px">
        <Kpi
          label="Orders today"
          value={metrics ? String(metrics.todayOrders) : "—"}
          hint={metrics ? `${money(metrics.todayRevenueCents, "USD")} nominal` : undefined}
        />
        <Kpi
          label="Last 7 days"
          value={metrics ? String(metrics.week7Orders) : "—"}
          hint={metrics ? `${money(metrics.week7RevenueCents, "USD")} nominal` : undefined}
        />
        <Kpi label="Website orders" value={overview.counts.orders.toLocaleString()} />
        <Kpi label="Recorded revenue" value={money(overview.revenueCents, "USD")} hint="Mixed currencies, nominal" />
        <Kpi
          label="Average order"
          value={metrics ? money(metrics.averageOrderCents, "USD") : "—"}
          hint="All-time, nominal"
        />
        <Kpi
          label="Open orders"
          value={metrics ? String(metrics.openOrders) : "—"}
          hint="Received · confirmed · processing · hold"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px">
        <Kpi label="Awaiting fulfilment" value={metrics ? String(metrics.awaitingFulfilment) : "—"} />
        <Kpi label="In transit" value={metrics ? String(metrics.inTransit) : "—"} />
        <Kpi label="Delivered" value={metrics ? String(metrics.delivered) : "—"} />
        <Kpi label="Products" value={String(overview.counts.products)} />
        <Kpi label="Reviews" value={String(overview.counts.reviews)} />
        <Kpi
          label="Push failures"
          value={metrics ? String(metrics.pushFailures.length) : "—"}
          hint="Latest ERP / CRM errors"
        />
      </div>

      {metrics && (
        <Panel
          title="Revenue · last 30 days"
          actions={
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {metrics.daily.reduce((s, d) => s + d.orders, 0)} orders
            </span>
          }
        >
          <div className="px-5 py-5">
            <Sparkbars data={metrics.daily} />
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>{metrics.daily[0]?.date}</span>
              <span>{metrics.daily[metrics.daily.length - 1]?.date}</span>
            </div>
          </div>
        </Panel>
      )}

      {metrics && (
        <div className="grid gap-px lg:grid-cols-3">
          <Panel title="Revenue by currency">
            {currencyRows.length === 0 ? (
              <p className="p-5 text-xs text-muted-foreground">No revenue recorded yet.</p>
            ) : (
              <table className="w-full text-[12px]">
                <tbody>
                  {currencyRows.map(([currency, cents]) => (
                    <tr key={currency} className="border-t hairline first:border-t-0">
                      <td className="px-5 py-2 font-semibold uppercase tracking-[0.14em]">{currency}</td>
                      <td className="px-5 py-2 text-right">{money(cents, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel title="Lifecycle mix">
            {statusRows.length === 0 ? (
              <p className="p-5 text-xs text-muted-foreground">No orders recorded yet.</p>
            ) : (
              <ul className="divide-y hairline">
                {statusRows.map(([status, count]) => (
                  <li key={status} className="px-5 py-2.5 flex items-center gap-3">
                    <StatusPill status={status} />
                    <div className="flex-1 h-[6px] bg-ink/[0.08]">
                      <div
                        className="h-full bg-forest"
                        style={{ width: `${Math.max(2, (count / statusTotal) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold tabular-nums">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Best sellers">
            {metrics.topProducts.length === 0 ? (
              <p className="p-5 text-xs text-muted-foreground">No line items yet.</p>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-ink/[0.03]">
                  <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-5 py-2">Product</th>
                    <th className="px-5 py-2 text-right">Units</th>
                    <th className="px-5 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.topProducts.map((p) => (
                    <tr key={p.name} className="border-t hairline">
                      <td className="px-5 py-2">{p.name}</td>
                      <td className="px-5 py-2 text-right tabular-nums">{p.units}</td>
                      <td className="px-5 py-2 text-right tabular-nums">{money(p.revenueCents, "USD")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      )}

      {metrics && metrics.pushFailures.length > 0 && (
        <Panel
          title="Integration failures"
          actions={
            <Link
              to="/admin/orders"
              className="border hairline px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              Resolve in order desk
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-ink/[0.03]">
                <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-2">Target</th>
                  <th className="px-5 py-2">Error</th>
                  <th className="px-5 py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {metrics.pushFailures.map((f) => (
                  <tr key={f.id} className="border-t hairline">
                    <td className="px-5 py-2 font-semibold">{f.target_code}</td>
                    <td className="px-5 py-2 text-destructive">{f.error_message ?? "Unknown error"}</td>
                    <td className="px-5 py-2 whitespace-nowrap">{new Date(f.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel
        title="Latest website orders"
        actions={
          <Link
            to="/admin/orders"
            className="border hairline px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
          >
            Open order management
          </Link>
        }
      >
        <div className="overflow-x-auto">
          {overview.recentOrders.length === 0 ? (
            <p className="p-5 text-xs text-muted-foreground">No orders recorded yet.</p>
          ) : (
            <table className="w-full text-[12px]">
              <thead className="bg-ink/[0.03]">
                <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-2">Order</th>
                  <th className="px-5 py-2">Customer</th>
                  <th className="px-5 py-2">Country</th>
                  <th className="px-5 py-2">Total</th>
                  <th className="px-5 py-2">Status</th>
                  <th className="px-5 py-2">Routed</th>
                  <th className="px-5 py-2">Placed</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t hairline">
                    <td className="px-5 py-2 font-semibold">
                      <Link to="/admin/orders" search={{ q: o.order_number }} className="underline decoration-1">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-2">{o.customer_name}</td>
                    <td className="px-5 py-2">{o.country_code}</td>
                    <td className="px-5 py-2">{money(o.grand_total_cents ?? 0, o.currency)}</td>
                    <td className="px-5 py-2">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-2">{o.routed_target_code ?? "—"}</td>
                    <td className="px-5 py-2 whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>

      <EmailTemplatePreviews />

      {mirror && (
        <>
          <Panel
            title="greenwealth.com store mirror"
            actions={
              <AdminButton onClick={handleResync} disabled={syncing}>
                {syncing ? "Syncing" : "Re-sync now"}
              </AdminButton>
            }
          >
            <p className="px-5 py-4 text-xs text-muted-foreground">
              {mirror.orders.toLocaleString()} orders · {mirror.customers.toLocaleString()} customers
              {mirror.lastSyncedAt ? ` · last synced ${new Date(mirror.lastSyncedAt).toLocaleString()}` : ""}
            </p>
          </Panel>

          <div className="grid gap-px xl:grid-cols-2">
            <Panel title="Mirrored orders">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink/[0.03]">
                    <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                      <th className="px-5 py-2">Reference</th>
                      <th className="px-5 py-2">Customer</th>
                      <th className="px-5 py-2">Country</th>
                      <th className="px-5 py-2">Total</th>
                      <th className="px-5 py-2">Status</th>
                      <th className="px-5 py-2">Payment</th>
                      <th className="px-5 py-2">Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mirror.recentOrders.map((o) => (
                      <tr key={o.id} className="border-t hairline">
                        <td className="px-5 py-2 font-semibold">{o.reference}</td>
                        <td className="px-5 py-2">{o.customer_name ?? "—"}</td>
                        <td className="px-5 py-2">{o.country_code ?? "—"}</td>
                        <td className="px-5 py-2">
                          {o.currency} {Number(o.total ?? 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-2 uppercase">{o.status ?? "—"}</td>
                        <td className="px-5 py-2 uppercase">{o.payment_status ?? "—"}</td>
                        <td className="px-5 py-2 whitespace-nowrap">
                          {o.placed_at ? new Date(o.placed_at).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Top mirrored customers">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink/[0.03]">
                    <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                      <th className="px-5 py-2">Name</th>
                      <th className="px-5 py-2">Email</th>
                      <th className="px-5 py-2">Phone</th>
                      <th className="px-5 py-2">Orders</th>
                      <th className="px-5 py-2">Lifetime value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mirror.topCustomers.map((c) => (
                      <tr key={c.id} className="border-t hairline">
                        <td className="px-5 py-2 font-semibold">{c.name ?? "—"}</td>
                        <td className="px-5 py-2">{c.email ?? "—"}</td>
                        <td className="px-5 py-2">{c.phone ?? "—"}</td>
                        <td className="px-5 py-2">{c.orders_count}</td>
                        <td className="px-5 py-2">
                          {c.currency} {Number(c.lifetime_value ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

/** Email every branded template to the signed-in staff inbox for design review. */
function EmailTemplatePreviews() {
  const send = useServerFn(sendEmailTemplatePreviews);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState<string>("");

  return (
    <Panel
      title="Email templates"
      actions={
        <AdminButton
          variant="solid"
          disabled={state === "sending"}
          onClick={async () => {
            setState("sending");
            setDetail("");
            try {
              const res = await send();
              if (res.ok) {
                setState("done");
                setDetail(
                  `Sent ${res.sent.length} to ${res.to}${res.failed.length ? ` · failed: ${res.failed.join(", ")}` : ""}`,
                );
              } else {
                setState("error");
                setDetail(res.error);
              }
            } catch {
              setState("error");
              setDetail("Send failed.");
            }
          }}
        >
          {state === "sending" ? "Sending" : "Email me all templates"}
        </AdminButton>
      }
    >
      <p className="px-5 py-4 text-xs text-muted-foreground">
        Order confirmation · Shipment tracking · Sign-in OTP · Abandoned cart · Contact acknowledgement · Contact
        internal alert. {detail}
      </p>
    </Panel>
  );
}
