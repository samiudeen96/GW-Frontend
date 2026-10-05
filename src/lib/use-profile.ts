/**
 * Module: Customer profile hook (client)
 *
 * Purpose: read and update the shopper's display identity (first name, last
 * name, phone, avatar) which is stored on the Lovable Cloud auth user record.
 * Users: /account portal header and Profile tab.
 * Integration points: Lovable Cloud auth user metadata, src/lib/profile.functions.ts.
 */

import { useCallback, useEffect, useState } from "react";

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
};

const EMPTY: CustomerProfile = { firstName: "", lastName: "", phone: "", avatarUrl: null };

function fromMetadata(meta: Record<string, unknown> | undefined): CustomerProfile {
  const str = (k: string) => {
    const v = meta?.[k];
    return typeof v === "string" ? v.trim() : "";
  };
  const full = str("full_name") || str("name");
  const [firstFromFull = "", ...restFromFull] = full.split(/\s+/);
  return {
    firstName: str("first_name") || firstFromFull,
    lastName: str("last_name") || restFromFull.join(" "),
    phone: str("phone") || str("phone_number"),
    avatarUrl: str("avatar_url") || str("picture") || null,
  };
}

export function useProfile(enabled = true) {
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setProfile(fromMetadata(data.user?.user_metadata as Record<string, unknown> | undefined));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [enabled]);

  const save = useCallback(async (next: Partial<CustomerProfile>) => {
    const merged = { ...profile, ...next };
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: merged.firstName,
        last_name: merged.lastName,
        full_name: [merged.firstName, merged.lastName].filter(Boolean).join(" "),
        phone: merged.phone,
        ...(merged.avatarUrl ? { avatar_url: merged.avatarUrl } : {}),
      },
    });
    if (error) throw new Error(error.message);
    setProfile(merged);
  }, [profile]);

  return { profile, loading, save };
}

export function initials(profile: CustomerProfile, email: string | null) {
  const a = profile.firstName.trim()[0];
  const b = profile.lastName.trim()[0];
  if (a || b) return `${a ?? ""}${b ?? ""}`.toUpperCase();
  return (email ?? "?").trim()[0]?.toUpperCase() ?? "?";
}

export function displayName(profile: CustomerProfile, email: string | null) {
  const full = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  return email ? email.split("@")[0]! : "Guest";
}

/** Downscales a picked file to a square avatar data URL for upload. */
export async function fileToAvatarDataUrl(file: File, size = 512): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process this image.");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  return canvas.toDataURL("image/jpeg", 0.9);
}
