/** Security tab: sign-in method note + set/replace password. */
import { useState } from "react";

import { setAccountPassword } from "@/lib/api/account";
import { useI18n } from "@/lib/i18n/react";

import { SectionTitle } from "./AccountParts";

export function SecurityTab() {
  const { t } = useI18n();
  return (
    <div>
      <SectionTitle>{t("commerce.account.security", "Security")}</SectionTitle>
      <div className="mb-6 border hairline p-6">
        <h3 className="mb-2 text-xs font-bold tracking-[0.18em] uppercase">
          {t("commerce.account.signInMethod", "Sign-in method")}
        </h3>
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
      const res = await setAccountPassword({ password });
      if (!res.ok) setMsg({ kind: "err", text: res.error });
      else {
        setPassword("");
        setConfirm("");
        setMsg({
          kind: "ok",
          text: "Password saved. You can now sign in with email and password.",
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm border hairline p-6">
      <h3 className="mb-1 text-xs font-bold tracking-[0.18em] uppercase">Set a password</h3>
      <p className="mb-4 text-xs text-muted-foreground">
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
          aria-label="New password"
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
          aria-label="Confirm password"
          className="w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="w-full bg-forest px-6 py-3 text-xs font-semibold tracking-[0.2em] text-paper uppercase disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save password"}
        </button>
        {msg && (
          <p
            className={`border px-3 py-2 text-xs ${
              msg.kind === "ok"
                ? "hairline bg-moss/5 text-muted-foreground"
                : "border-destructive bg-destructive/5 font-semibold text-destructive"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}
