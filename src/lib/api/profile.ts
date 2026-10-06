/**
 * Customer profile (browser): display identity shown in the account portal.
 * TODO(api): wire to the backend profile endpoints.
 */
import type { ActionResult } from "./types";

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
};

export const EMPTY_PROFILE: CustomerProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  avatarUrl: null,
};

const NOT_CONNECTED = { ok: false as const, error: "Customer profiles are not connected yet." };

/** TODO(api): GET /account/profile. */
export async function getMyProfile(): Promise<ActionResult<CustomerProfile>> {
  return NOT_CONNECTED;
}

/** Merge and save profile fields. TODO(api): PATCH /account/profile. */
export async function updateMyProfile(
  _input: Partial<CustomerProfile>,
): Promise<ActionResult<CustomerProfile>> {
  return NOT_CONNECTED;
}

/** Upload a square avatar (JPEG data URL). TODO(api): POST /account/avatar. */
export async function uploadMyAvatar(_input: {
  dataUrl: string;
}): Promise<ActionResult<{ url: string }>> {
  return { ok: false, error: "Profile photo upload is not connected yet." };
}
