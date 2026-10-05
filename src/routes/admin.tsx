/**
 * Module: Admin console shell (layout route).
 *
 * Purpose: staff sign-in, role gate and shared navigation chrome for every
 * /admin screen (overview, order management).
 * Users: Green Wealth owners / admins.
 * Integration points: src/lib/admin.functions.ts (server-side role checks).
 */

import { abs } from "@/lib/seo";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/site/Page";
import { supabase } from "@/integrations/supabase/client";
import { getAdminAccess } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Green Wealth" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: abs("/admin") }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const loadAccess = useServerFn(getAdminAccess);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [access, setAccess] = useState<{ role: string | null; email: string | null } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
      if (!session) setAccess(null);
    });
    supabase.auth.getSession().then(({ data: s }) => setSignedIn(!!s.session));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    loadAccess()
      .then((d) => {
        if (!cancelled) setAccess(d);
      })
      .catch(() => {
        if (!cancelled) setAccess({ role: null, email: null });
      });
    return () => {
      cancelled = true;
    };
  }, [signedIn, loadAccess]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAccess(null);
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message);
  }

  if (signedIn === null) {
    return (
      <div className="container-editorial py-24 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading
      </div>
    );
  }

  if (!signedIn) {
    return (
      <>
        <PageHeader eyebrow="Restricted" title="Admin console" />
        <div className="container-editorial py-16 max-w-md">
          <form onSubmit={handleSignIn} className="border hairline bg-paper p-8 space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold">Staff sign in</p>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] mb-2" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border hairline bg-transparent px-3 py-3 text-base"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] mb-2" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border hairline bg-transparent px-3 py-3 text-base"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold disabled:opacity-50"
            >
              {busy ? "Signing in" : "Sign in"}
            </button>
            <p className="text-[11px] text-muted-foreground">
              Restricted to authorised Ghori Trading personnel.
            </p>
          </form>
        </div>
      </>
    );
  }

  if (!access) {
    return (
      <div className="container-editorial py-24 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Checking access
      </div>
    );
  }

  if (!access.role) {
    return (
      <>
        <PageHeader eyebrow="Restricted" title="Admin console" />
        <div className="container-editorial py-16 max-w-md text-center space-y-6">
          <p className="text-sm text-destructive font-semibold">This account does not have admin access.</p>
          <button onClick={signOut} className="border hairline px-6 py-3 text-xs uppercase tracking-[0.2em]">
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-ink/[0.04]">
      <header className="sticky top-0 z-30 border-b hairline bg-paper">
        <div className="container-admin flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="flex items-baseline gap-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Green Wealth · Operations console
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold">
              {access.role} · {access.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="border hairline px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              View storefront
            </Link>
            <button
              onClick={signOut}
              className="border hairline px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-admin flex gap-px pt-px">
        <aside className="hidden lg:block w-56 shrink-0 bg-paper border-r hairline">
          <div className="sticky top-[57px] py-4">
            <AdminNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="lg:hidden bg-paper border-b hairline px-3 py-3">
            <AdminNav horizontal />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const NAV: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/orders", label: "Order desk" },
];

function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  return (
    <nav className={horizontal ? "flex flex-wrap gap-2" : "flex flex-col"}>
      {!horizontal && (
        <p className="px-5 pb-3 text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Workspaces</p>
      )}
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={item.exact ? { exact: true } : undefined}
          activeProps={{ className: horizontal ? "bg-forest text-paper" : "bg-forest text-paper" }}
          className={
            horizontal
              ? "border hairline px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold"
              : "px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-semibold border-b hairline"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
