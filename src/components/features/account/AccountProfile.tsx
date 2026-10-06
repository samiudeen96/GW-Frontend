/** Profile tab: avatar, personal details and account record. */
import { useState } from "react";

import type { AccountStats } from "@/lib/api/account";
import { uploadMyAvatar, type CustomerProfile } from "@/lib/api/profile";
import { useI18n } from "@/lib/i18n/react";

import { dateLabel } from "./account-format";
import { AvatarBlock, Field, SectionTitle } from "./AccountParts";
import { fileToAvatarDataUrl, initials } from "./profile-utils";

type Props = {
  email: string | null;
  stats: AccountStats | undefined;
  profile: CustomerProfile;
  onSave: (next: Partial<CustomerProfile>) => Promise<void>;
  addressCount: number;
  latestAddressName: string | null;
};

export function ProfileTab({
  email,
  stats,
  profile,
  onSave,
  addressCount,
  latestAddressName,
}: Props) {
  const { t, path } = useI18n();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const suggestion = firstName || lastName || !latestAddressName ? null : latestAddressName;

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
      const res = await uploadMyAvatar({ dataUrl });
      if (!res.ok) throw new Error(res.error);
      await onSave({ avatarUrl: res.data.url });
      setMsg({ kind: "ok", text: t("commerce.account.photoSaved", "Profile photo updated.") });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Could not upload image." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <SectionTitle note={email ?? undefined}>
        {t("commerce.account.profile", "Profile")}
      </SectionTitle>

      <div className="mb-px flex flex-col items-start gap-6 border hairline bg-paper p-6 sm:flex-row">
        <AvatarBlock url={profile.avatarUrl} fallback={initials(profile, email)} />
        <div className="min-w-0">
          <h3 className="mb-2 text-xs font-bold tracking-[0.18em] uppercase">
            {t("commerce.account.profilePhoto", "Profile photo")}
          </h3>
          <p className="mb-4 max-w-sm text-xs text-muted-foreground">
            {t(
              "commerce.account.profilePhotoBody",
              "JPG, PNG or WebP up to 2 MB. Your photo is private to your account and never shown publicly.",
            )}
          </p>
          <label className="inline-flex cursor-pointer border hairline px-5 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase">
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

      <div className="mb-6 border hairline bg-paper p-6">
        <h3 className="mb-4 text-xs font-bold tracking-[0.18em] uppercase">
          {t("commerce.account.personalDetails", "Personal details")}
        </h3>
        <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
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
            <p className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("commerce.trackOrder.email", "Email")}
            </p>
            <p className="border hairline bg-moss/[0.04] px-3 py-3 text-sm break-words">
              {email ?? "—"}
            </p>
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
            className="mt-4 text-[11px] font-semibold tracking-[0.16em] uppercase underline"
          >
            {t("commerce.account.useOrderName", "Use name from last order")} · {suggestion}
          </button>
        )}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => void saveDetails()}
            disabled={busy}
            className="bg-forest px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-paper uppercase disabled:opacity-50"
          >
            {busy
              ? t("commerce.account.saving", "Saving…")
              : t("commerce.account.saveChanges", "Save changes")}
          </button>
          {msg && (
            <p
              className={`text-xs ${
                msg.kind === "ok" ? "text-muted-foreground" : "font-semibold text-destructive"
              }`}
            >
              {msg.text}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border hairline bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label={t("commerce.account.ordersPlaced", "Orders placed")}
          value={String(stats?.orderCount ?? 0)}
        />
        <Field
          label={t("commerce.account.metric.savedAddresses", "Saved addresses")}
          value={String(addressCount)}
        />
        <Field
          label={t("commerce.account.firstOrder", "First order")}
          value={dateLabel(stats?.firstOrderAt ?? null)}
        />
        <Field
          label={t("commerce.account.latestOrder", "Latest order")}
          value={dateLabel(stats?.lastOrderAt ?? null)}
        />
      </div>

      <div className="mt-6 border hairline p-6">
        <h3 className="mb-2 text-xs font-bold tracking-[0.18em] uppercase">
          {t("commerce.account.needChange", "Need a change?")}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {t(
            "commerce.account.needChangeBody",
            "Your email is your account identity. For name, phone or email changes, contact our team and we will update your record.",
          )}
        </p>
        <a
          href={path("/contact")}
          className="text-xs font-semibold tracking-[0.18em] uppercase underline"
        >
          {t("commerce.payment.contactSupport", "Contact support")}
        </a>
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
      <p className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <input
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest"
      />
    </div>
  );
}
