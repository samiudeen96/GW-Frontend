/**
 * Module: Order management workspace.
 *
 * Purpose: full-flagged order desk — KPI header, saved views, multi-facet
 * filtering, sortable dense grid, bulk lifecycle actions, CSV export and a
 * split-view detail drawer with items, fulfilment, ERP push log, audit
 * timeline, staff notes and customer history.
 * Users: Green Wealth order desk (owner / admin roles).
 * Integration points: src/lib/admin-orders.functions.ts → Lovable Cloud,
 * Odoo / GoHighLevel adapters, Resend order emails.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminButton, Field, Kpi, Panel, Sparkbars, StatusPill, inputClass, money } from "@/components/admin/primitives";
import { ORDER_STATUSES } from "@shared/order-statuses";
import {
  adminAddOrderNote,
  adminExportOrdersCsv,
  adminListOrders,
  adminOrderDetail,
  adminOrderMetrics,
  adminResendConfirmation,
  adminRetryPush,
  adminSetTracking,
  adminUpdateOrderStatus,
} from "@/lib/admin-orders.functions";
import { carrierLabel } from "@shared/tracking";

type Search = { q?: string; status?: string; view?: string };

export const Route = createFileRoute("/admin/orders")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search['q'] === "string" ? search['q'] : undefined,
    status: typeof search['status'] === "string" ? search['status'] : undefined,
    view: typeof search['view'] === "string" ? search['view'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Desk — Green Wealth Admin" },
      { name: "description", content: "Staff order management workspace for Green Wealth: lifecycle, fulfilment, ERP push and exports." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Order Desk — Green Wealth Admin" },
      { property: "og:description", content: "Staff order management workspace for Green Wealth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersWorkspace,

});

type ListResult = Awaited<ReturnType<typeof adminListOrders>>;
type Detail = Awaited<ReturnType<typeof adminOrderDetail>>;
type Metrics = Awaited<ReturnType<typeof adminOrderMetrics>>;

type Filters = {
  search: string;
  statuses: string[];
  currencies: string[];
  channels: string[];
  targets: string[];
  fulfilment: "any" | "unfulfilled" | "shipped" | "delivered";
  from: string;
  to: string;
  sort: "created_at" | "grand_total_cents" | "customer_name" | "status";
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
};

const EMPTY: Filters = {
  search: "",
  statuses: [],
  currencies: [],
  channels: [],
  targets: [],
  fulfilment: "any",
  from: "",
  to: "",
  sort: "created_at",
  dir: "desc",
  page: 1,
  pageSize: 25,
};

const SAVED_VIEWS: { key: string; label: string; patch: Partial<Filters> }[] = [
  { key: "all", label: "All orders", patch: {} },
  { key: "open", label: "Needs action", patch: { statuses: ["received", "confirmed", "processing", "on_hold"] } },
  { key: "unfulfilled", label: "Awaiting shipment", patch: { fulfilment: "unfulfilled", statuses: ["confirmed", "processing"] } },
  { key: "transit", label: "In transit", patch: { fulfilment: "shipped" } },
  { key: "delivered", label: "Delivered", patch: { fulfilment: "delivered" } },
  { key: "sar", label: "SAR (Abq Alahlam)", patch: { currencies: ["SAR"] } },
  { key: "problem", label: "Cancelled / refunded", patch: { statuses: ["cancelled", "refunded"] } },
];

function OrdersWorkspace() {
  const search = Route.useSearch();
  const list = useServerFn(adminListOrders);
  const loadMetrics = useServerFn(adminOrderMetrics);
  const loadDetail = useServerFn(adminOrderDetail);
  const updateStatus = useServerFn(adminUpdateOrderStatus);
  const exportCsv = useServerFn(adminExportOrdersCsv);

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY,
    search: search.q ?? "",
    statuses: search.status ? [search.status] : [],
  });
  const [view, setView] = useState(search.view ?? "all");
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const [data, setData] = useState<ListResult | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [bulkStatus, setBulkStatus] = useState<string>("processing");
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.statuses.length ? { statuses: filters.statuses } : {}),
      ...(filters.currencies.length ? { currencies: filters.currencies } : {}),
      ...(filters.channels.length ? { channels: filters.channels } : {}),
      ...(filters.targets.length ? { targets: filters.targets } : {}),
      ...(filters.fulfilment !== "any" ? { fulfilment: filters.fulfilment } : {}),
      ...(filters.from ? { from: filters.from } : {}),
      ...(filters.to ? { to: filters.to } : {}),
      sort: filters.sort,
      dir: filters.dir,
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    [filters],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await list({ data: payload }));
      setError(null);
    } catch {
      setError("Could not load orders. Your session may have expired.");
    } finally {
      setLoading(false);
    }
  }, [list, payload]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    loadMetrics()
      .then(setMetrics)
      .catch(() => {});
  }, [loadMetrics]);

  const reloadDetail = useCallback(
    async (orderNumber: string) => {
      setDetail(await loadDetail({ data: { orderNumber } }));
    },
    [loadDetail],
  );

  useEffect(() => {
    if (!openOrder) {
      setDetail(null);
      return;
    }
    setDetail(null);
    void reloadDetail(openOrder);
  }, [openOrder, reloadDetail]);

  function patch(next: Partial<Filters>) {
    setFilters((f) => ({ ...f, page: 1, ...next }));
    setSelected([]);
  }

  function toggleArray(key: "statuses" | "currencies" | "channels" | "targets", value: string) {
    setFilters((f) => {
      const current = f[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...f, page: 1, [key]: next };
    });
  }

  function applyView(key: string) {
    const found = SAVED_VIEWS.find((v) => v.key === key);
    setView(key);
    setSearchDraft("");
    setFilters({ ...EMPTY, ...(found?.patch ?? {}) });
    setSelected([]);
  }

  const rows = data?.rows ?? [];
  const facets = data?.facets;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const allSelected = rows.length > 0 && selected.length === rows.length;

  async function runBulk() {
    if (!selected.length) return;
    const res = await updateStatus({
      data: { orderNumbers: selected, status: bulkStatus as (typeof ORDER_STATUSES)[number] },
    });
    setFlash(res.ok ? `Updated ${res.updated} order(s) to ${bulkStatus}.` : res.error ?? "Update failed.");
    setSelected([]);
    await refresh();
    if (openOrder) await reloadDetail(openOrder);
  }

  async function handleExport() {
    const { csv } = await exportCsv({ data: payload });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `green-wealth-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container-admin py-6 space-y-px bg-ink/[0.06]">
      {/* KPI header */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px">
        <Kpi
          label="Orders today"
          value={metrics ? String(metrics.todayOrders) : "—"}
          hint={metrics ? money(metrics.todayRevenueCents, "USD") : undefined}
        />
        <Kpi
          label="Last 7 days"
          value={metrics ? String(metrics.week7Orders) : "—"}
          hint={metrics ? money(metrics.week7RevenueCents, "USD") : undefined}
        />
        <Kpi label="Awaiting shipment" value={metrics ? String(metrics.awaitingFulfilment) : "—"} />
        <Kpi label="In transit" value={metrics ? String(metrics.inTransit) : "—"} />
        <Kpi label="Delivered" value={metrics ? String(metrics.delivered) : "—"} />
        <Kpi
          label="Average order"
          value={metrics ? money(metrics.averageOrderCents, "USD") : "—"}
          hint="Nominal, mixed currencies"
        />
      </div>

      {metrics && (
        <div className="grid lg:grid-cols-3 gap-px">
          <Panel title="Revenue · last 30 days" className="lg:col-span-2">
            <div className="p-5">
              <Sparkbars data={metrics.daily} />
              <p className="mt-3 text-[11px] text-muted-foreground">
                {metrics.daily.reduce((s, d) => s + d.orders, 0)} orders in the window ·{" "}
                {Object.entries(metrics.revenueByCurrency)
                  .map(([c, v]) => money(v, c))
                  .join(" · ")}
              </p>
            </div>
          </Panel>
          <Panel title="Top products">
            <ul className="divide-y hairline">
              {metrics.topProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-4 px-5 py-2.5 text-[12px]">
                  <span className="truncate">{p.name}</span>
                  <span className="whitespace-nowrap text-muted-foreground">{p.units} units</span>
                </li>
              ))}
              {metrics.topProducts.length === 0 && <li className="px-5 py-4 text-xs text-muted-foreground">No data.</li>}
            </ul>
          </Panel>
        </div>
      )}

      {metrics && metrics.pushFailures.length > 0 && (
        <Panel title={`ERP push failures (${metrics.pushFailures.length})`}>
          <ul className="divide-y hairline">
            {metrics.pushFailures.slice(0, 6).map((f) => (
              <li key={f.id} className="px-5 py-2.5 text-[12px] flex flex-wrap gap-x-4 gap-y-1">
                <span className="font-semibold uppercase tracking-[0.12em]">{f.target_code}</span>
                <span className="text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
                <span className="text-destructive">{f.error_message ?? "Unknown error"}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Saved views */}
      <Panel title="Saved views">
        <div className="flex flex-wrap gap-2 p-5">
          {SAVED_VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => applyView(v.key)}
              className={`border hairline px-4 py-2 text-[10px] uppercase tracking-[0.16em] font-semibold ${
                view === v.key ? "bg-forest text-paper" : ""
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* Filters */}
      <Panel
        title="Filters"
        actions={
          <>
            <AdminButton onClick={handleExport}>Export CSV</AdminButton>
            <AdminButton onClick={() => applyView("all")}>Reset</AdminButton>
            <AdminButton onClick={() => void refresh()}>Refresh</AdminButton>
          </>
        }
      >
        <div className="p-5 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              patch({ search: searchDraft.trim() });
            }}
            className="grid md:grid-cols-4 gap-4"
          >
            <div className="md:col-span-2">
              <Field label="Search — order, name, email, phone, tracking">
                <input
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="GW-260818-2HW42"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="From">
              <input type="date" value={filters.from} onChange={(e) => patch({ from: e.target.value })} className={inputClass} />
            </Field>
            <Field label="To">
              <input type="date" value={filters.to} onChange={(e) => patch({ to: e.target.value })} className={inputClass} />
            </Field>
            <button type="submit" className="hidden" aria-hidden />
          </form>

          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Fulfilment">
              <select
                value={filters.fulfilment}
                onChange={(e) => patch({ fulfilment: e.target.value as Filters["fulfilment"] })}
                className={inputClass}
              >
                <option value="any">Any</option>
                <option value="unfulfilled">Not shipped</option>
                <option value="shipped">Shipped, not delivered</option>
                <option value="delivered">Delivered</option>
              </select>
            </Field>
            <Field label="Sort by">
              <select
                value={filters.sort}
                onChange={(e) => patch({ sort: e.target.value as Filters["sort"] })}
                className={inputClass}
              >
                <option value="created_at">Placed date</option>
                <option value="grand_total_cents">Order value</option>
                <option value="customer_name">Customer</option>
                <option value="status">Status</option>
              </select>
            </Field>
            <Field label="Direction">
              <select
                value={filters.dir}
                onChange={(e) => patch({ dir: e.target.value as Filters["dir"] })}
                className={inputClass}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </Field>
            <Field label="Rows per page">
              <select
                value={String(filters.pageSize)}
                onChange={(e) => patch({ pageSize: Number(e.target.value) })}
                className={inputClass}
              >
                {[25, 50, 100, 200].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {facets && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
              <ChipGroup
                label="Status"
                values={facets.statuses}
                active={filters.statuses}
                counts={facets.statusCounts}
                onToggle={(v) => toggleArray("statuses", v)}
              />
              <ChipGroup
                label="Currency"
                values={facets.currencies}
                active={filters.currencies}
                onToggle={(v) => toggleArray("currencies", v)}
              />
              <ChipGroup
                label="Channel"
                values={facets.channels}
                active={filters.channels}
                onToggle={(v) => toggleArray("channels", v)}
              />
              <ChipGroup
                label="Routed company"
                values={facets.targets}
                active={filters.targets}
                labels={facets.targetNames}
                onToggle={(v) => toggleArray("targets", v)}
              />
            </div>
          )}
        </div>
      </Panel>

      {/* Bulk actions */}
      <Panel title={`Orders${data ? ` · ${data.total.toLocaleString()}` : ""}`}>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b hairline px-5 py-3">
          <div className="flex flex-wrap items-end gap-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {selected.length} selected
            </span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="border hairline bg-transparent px-3 py-2 text-[12px]"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <AdminButton variant="solid" disabled={!selected.length} onClick={runBulk}>
              Apply to selected
            </AdminButton>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {data
              ? Object.entries(data.totalsByCurrency)
                  .map(([c, v]) => money(v, c))
                  .join(" · ") || "—"
              : "—"}
          </div>
        </div>

        {flash && <p className="border-b hairline bg-moss/10 px-5 py-2 text-[12px]">{flash}</p>}
        {error && <p className="border-b hairline bg-destructive/10 px-5 py-2 text-[12px] text-destructive">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-ink/[0.03]">
              <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-4 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.order_number) : [])}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Placed</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Fulfilment</th>
                <th className="px-4 py-2">Routed</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Loading
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center text-xs text-muted-foreground">
                    No orders match these filters.
                  </td>
                </tr>
              )}
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className={`border-t hairline hover:bg-ink/[0.02] ${openOrder === o.order_number ? "bg-moss/10" : ""}`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(o.order_number)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked ? [...s, o.order_number] : s.filter((n) => n !== o.order_number),
                        )
                      }
                      aria-label={`Select ${o.order_number}`}
                    />
                  </td>
                  <td className="px-4 py-2 font-semibold whitespace-nowrap">{o.order_number}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className="block">{o.customer_name}</span>
                    <span className="block text-[11px] text-muted-foreground">{o.customer_email ?? "—"}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {o.country_code}
                    {o.shipping_address?.['city'] ? ` · ${o.shipping_address['city']}` : ""}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-semibold">{money(o.grand_total_cents, o.currency)}</td>
                  <td className="px-4 py-2 uppercase whitespace-nowrap">{o.payment_method ?? "—"}</td>
                  <td className="px-4 py-2">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {o.delivered_at
                      ? "Delivered"
                      : o.tracking_number
                        ? `${carrierLabel(o.tracking_carrier ?? "")} · ${o.tracking_number}`
                        : "Not shipped"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{o.routed_target_code ?? "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <AdminButton onClick={() => setOpenOrder(o.order_number === openOrder ? null : o.order_number)}>
                      {openOrder === o.order_number ? "Close" : "Open"}
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t hairline px-5 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Page {filters.page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <AdminButton
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
            >
              Previous
            </AdminButton>
            <AdminButton
              disabled={filters.page >= totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </AdminButton>
          </div>
        </div>
      </Panel>

      {openOrder && (
        <OrderDetail
          orderNumber={openOrder}
          detail={detail}
          onClose={() => setOpenOrder(null)}
          onChanged={async () => {
            await reloadDetail(openOrder);
            await refresh();
          }}
        />
      )}
    </div>
  );
}

function ChipGroup({
  label,
  values,
  active,
  counts,
  labels,
  onToggle,
}: {
  label: string;
  values: string[];
  active: string[];
  counts?: Record<string, number>;
  labels?: Record<string, string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.length === 0 && <span className="text-[11px] text-muted-foreground">—</span>}
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onToggle(v)}
            className={`border hairline px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-semibold ${
              active.includes(v) ? "bg-forest text-paper" : ""
            }`}
          >
            {(labels?.[v] ?? v).replace(/_/g, " ")}
            {counts?.[v] !== undefined ? ` ${counts[v]}` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ detail drawer ------------------------------ */

function OrderDetail({
  orderNumber,
  detail,
  onClose,
  onChanged,
}: {
  orderNumber: string;
  detail: Detail | null;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const setStatus = useServerFn(adminUpdateOrderStatus);
  const setTracking = useServerFn(adminSetTracking);
  const addNote = useServerFn(adminAddOrderNote);
  const resend = useServerFn(adminResendConfirmation);
  const retry = useServerFn(adminRetryPush);

  const [note, setNote] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notify, setNotify] = useState(true);
  const [status, setStatusValue] = useState<string>("processing");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!detail?.order) return;
    setCarrier(detail.order.tracking_carrier ?? "");
    setTrackingNumber(detail.order.tracking_number ?? "");
    setTrackingUrl(detail.order.tracking_url ?? "");
    setStatusValue(detail.order.status);
  }, [detail?.order]);

  async function run(key: string, fn: () => Promise<string>) {
    setBusy(key);
    setMessage(null);
    try {
      setMessage(await fn());
      await onChanged();
    } catch {
      setMessage("Action failed.");
    } finally {
      setBusy(null);
    }
  }

  if (!detail) {
    return (
      <Panel title={`Order ${orderNumber}`} actions={<AdminButton onClick={onClose}>Close</AdminButton>}>
        <p className="px-5 py-10 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading order</p>
      </Panel>
    );
  }

  const o = detail.order;
  const addr = (o.shipping_address ?? {}) as Record<string, string>;

  return (
    <Panel
      title={`Order ${o.order_number}`}
      actions={
        <>
          <AdminButton
            disabled={busy === "resend"}
            onClick={() =>
              run("resend", async () => {
                const res = await resend({ data: { orderNumber: o.order_number } });
                return res.ok ? "Confirmation email re-sent." : res.error;
              })
            }
          >
            {busy === "resend" ? "Sending" : "Re-send confirmation"}
          </AdminButton>
          <AdminButton
            disabled={busy === "retry"}
            onClick={() =>
              run("retry", async () => {
                const res = await retry({ data: { orderNumber: o.order_number } });
                return res.ok
                  ? `Pushed to ${res.routedTo ?? "ERP"}.`
                  : `Push failed: ${res.pushes?.map((p) => p.error).filter(Boolean).join("; ") ?? res.error ?? "unknown"}`;
              })
            }
          >
            {busy === "retry" ? "Pushing" : "Retry ERP push"}
          </AdminButton>
          <AdminButton onClick={onClose}>Close</AdminButton>
        </>
      }
    >
      {message && <p className="border-b hairline bg-moss/10 px-5 py-2 text-[12px]">{message}</p>}

      <div className="grid lg:grid-cols-3 gap-px bg-ink/[0.06]">
        {/* Left: customer + items */}
        <div className="lg:col-span-2 bg-paper p-5 space-y-6">
          <div className="grid sm:grid-cols-3 gap-5 text-[12px]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Customer</p>
              <p className="font-semibold">{o.customer_name}</p>
              <p>{o.customer_email ?? "—"}</p>
              <p>{o.customer_phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Ship to</p>
              <p>{addr['line1'] ?? "—"}</p>
              {addr['line2'] && <p>{addr['line2']}</p>}
              <p>
                {[addr['city'], addr['state'], addr['zip']].filter(Boolean).join(", ")}
              </p>
              <p>{addr['country'] ?? o.country_code}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Order</p>
              <p>Placed {new Date(o.created_at).toLocaleString()}</p>
              <p className="uppercase">Channel {o.source_channel}</p>
              <p className="uppercase">Payment {o.payment_method ?? "—"}</p>
              <p>
                Routed {o.routed_target_code ?? "unrouted"}
                {o.routing_reason ? ` — ${o.routing_reason}` : ""}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-ink/[0.03]">
                <tr className="text-left uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Line</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((i) => (
                  <tr key={i.id} className="border-t hairline">
                    <td className="px-3 py-2">{i.name}</td>
                    <td className="px-3 py-2">{i.quantity}</td>
                    <td className="px-3 py-2">{money(i.unit_price_cents, o.currency)}</td>
                    <td className="px-3 py-2 font-semibold">{money(i.line_total_cents, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t hairline">
                <tr>
                  <td colSpan={3} className="px-3 py-1.5 text-right text-muted-foreground">
                    Items
                  </td>
                  <td className="px-3 py-1.5">{money(o.items_total_cents, o.currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-3 py-1.5 text-right text-muted-foreground">
                    Shipping
                  </td>
                  <td className="px-3 py-1.5">{money(o.shipping_total_cents, o.currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-3 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">
                    Total
                  </td>
                  <td className="px-3 py-1.5 font-serif text-lg">{money(o.grand_total_cents, o.currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Activity timeline</p>
            <ul className="divide-y hairline border hairline">
              {detail.events.length === 0 && (
                <li className="px-3 py-3 text-[12px] text-muted-foreground">No staff activity recorded yet.</li>
              )}
              {detail.events.map((e) => (
                <li key={e.id} className="px-3 py-2.5 text-[12px]">
                  <p className="flex flex-wrap gap-x-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span>{e.kind}</span>
                    <span>{new Date(e.created_at).toLocaleString()}</span>
                    {e.actor_email && <span>{e.actor_email}</span>}
                  </p>
                  <p className="mt-1">{e.message}</p>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              void run("note", async () => {
                const res = await addNote({ data: { orderNumber: o.order_number, message: note.trim() } });
                setNote("");
                return res.ok ? "Note added." : res.error;
              });
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex-1 min-w-[240px]">
              <Field label="Internal note">
                <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <AdminButton type="submit" variant="solid" disabled={busy === "note"}>
              Add note
            </AdminButton>
          </form>
        </div>

        {/* Right: lifecycle, fulfilment, integrations, history */}
        <div className="bg-paper p-5 space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Lifecycle</p>
            <div className="flex items-center gap-3">
              <StatusPill status={o.status} />
              <select
                value={status}
                onChange={(e) => setStatusValue(e.target.value)}
                className="border hairline bg-transparent px-3 py-2 text-[12px]"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <AdminButton
              variant="solid"
              disabled={busy === "status"}
              onClick={() =>
                run("status", async () => {
                  const res = await setStatus({
                    data: { orderNumbers: [o.order_number], status: status as (typeof ORDER_STATUSES)[number] },
                  });
                  return res.ok ? `Status set to ${status}.` : res.error;
                })
              }
            >
              Update status
            </AdminButton>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Fulfilment</p>
            <Field label="Carrier">
              <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="DHL, Aramex, SMSA…" className={inputClass} />
            </Field>
            <Field label="Tracking number">
              <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Tracking URL (optional)">
              <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
              Email the customer
            </label>
            <div className="flex flex-wrap gap-2">
              <AdminButton
                variant="solid"
                disabled={busy === "track" || !trackingNumber.trim()}
                onClick={() =>
                  run("track", async () => {
                    const res = await setTracking({
                      data: {
                        orderNumber: o.order_number,
                        carrier,
                        trackingNumber,
                        ...(trackingUrl ? { trackingUrl } : {}),
                        notifyCustomer: notify,
                      },
                    });
                    return res.ok ? `Tracking saved${res.emailed ? " · customer notified" : ""}.` : res.error;
                  })
                }
              >
                Save tracking
              </AdminButton>
              <AdminButton
                disabled={busy === "delivered"}
                onClick={() =>
                  run("delivered", async () => {
                    const res = await setTracking({
                      data: {
                        orderNumber: o.order_number,
                        carrier,
                        trackingNumber,
                        markDelivered: true,
                        notifyCustomer: false,
                      },
                    });
                    return res.ok ? "Marked delivered." : res.error;
                  })
                }
              >
                Mark delivered
              </AdminButton>
            </div>
            {o.tracking_url && (
              <a
                href={o.tracking_url}
                target="_blank"
                rel="noreferrer"
                className="block text-[11px] underline decoration-1 break-all"
              >
                {o.tracking_url}
              </a>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">ERP / CRM pushes</p>
            <ul className="divide-y hairline border hairline">
              {detail.pushes.length === 0 && (
                <li className="px-3 py-3 text-[12px] text-muted-foreground">No push attempts recorded.</li>
              )}
              {detail.pushes.map((p) => (
                <li key={p.id} className="px-3 py-2.5 text-[12px]">
                  <p className="flex flex-wrap items-center gap-x-3">
                    <span className="font-semibold uppercase tracking-[0.12em]">{p.target_code}</span>
                    <span className={p.status === "success" ? "text-forest" : "text-destructive"}>{p.status}</span>
                    <span className="text-muted-foreground">attempt {p.attempt}</span>
                  </p>
                  {p.external_reference && <p className="text-muted-foreground">Ref {p.external_reference}</p>}
                  {p.error_message && <p className="text-destructive">{p.error_message}</p>}
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {new Date(p.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Customer history</p>
            <ul className="divide-y hairline border hairline">
              {detail.customerHistory.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 px-3 py-2 text-[12px]">
                  <span className="font-semibold">{h.order_number}</span>
                  <span>{money(h.grand_total_cents, h.currency)}</span>
                  <span className="text-muted-foreground uppercase text-[10px] tracking-[0.12em]">{h.status}</span>
                </li>
              ))}
              {detail.customerHistory.length === 0 && (
                <li className="px-3 py-3 text-[12px] text-muted-foreground">No other orders.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Panel>
  );
}
