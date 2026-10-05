/**
 * Module: Session hook (client)
 *
 * Purpose: expose the current signed-in customer to UI without pulling the
 * Supabase auth client into the initial bundle.
 * Users: account page, checkout contact step, header.
 * Integration points: Lovable Cloud auth (email one-time codes).
 */

import { useEffect, useState } from "react";

export type SessionUser = { id: string; email: string | null };

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const u = data.session?.user;
      setUser(u ? { id: u.id, email: u.email ?? null } : null);
      setLoading(false);

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        const su = session?.user;
        setUser(su ? { id: su.id, email: su.email ?? null } : null);
      });
      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  const signOut = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signOut };
}
