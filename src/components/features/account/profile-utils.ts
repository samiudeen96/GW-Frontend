/** Customer profile display helpers (island-safe; `fileToAvatarDataUrl` is browser-only). */
import type { CustomerProfile } from "@/lib/api/profile";

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
