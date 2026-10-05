import { useEffect, useState } from "react";
import { requestEmailOtp, exchangeEmailOtp } from "@/lib/auth.functions";
import { useT } from "@/lib/i18n";

type Props = {
  defaultEmail?: string;
  compact?: boolean;
  onSignedIn?: (email: string) => void;
};

const inputCls =
  "w-full border hairline bg-paper px-3 py-3 text-base outline-none focus:border-forest";

const labelCls =
  "block text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground";

const btnCls =
  "w-full bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold disabled:opacity-50";

export function EmailOtpSignIn({ defaultEmail = "", compact = false, onSignedIn }: Props) {
  const t = useT();
  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const tmr = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(tmr);
  }, [cooldown]);

  const cleanEmail = () => email.trim().toLowerCase();
  const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

  const sendCode = async () => {
    const clean = cleanEmail();
    if (!validEmail(clean)) {
      setError(t("commerce.auth.invalidEmail", "Enter a valid email address."));
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      // Retry once: the RPC call can fail transiently with a proxy/network error.
      let res: { ok: boolean; error?: string } | null = null;
      let lastErr: unknown = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await requestEmailOtp({ data: { email: clean } });
          break;
        } catch (err) {
          lastErr = err;
          await new Promise((r) => setTimeout(r, 800));
        }
      }
      if (!res) throw lastErr ?? new Error("request failed");
      if (!res.ok) {
        setError(res.error ?? t("commerce.auth.sendFailed", "We could not send the code. Please try again."));
      } else {
        setEmail(clean);
        setStage("code");
        setCooldown(45);
        setNotice(`${t("commerce.auth.otpSentPrefix", "Green Wealth OTP sent to")} ${clean}. ${t("commerce.auth.otpExpires", "It expires in 10 minutes.")}`);
      }
    } catch {
      setError(t("commerce.auth.connectionDropped", "The connection dropped while sending your OTP. Please tap “Email me an OTP” again."));
    } finally {
      setBusy(false);
    }
  };


  const verify = async () => {
    if (code.length !== 6) {
      setError(t("commerce.auth.enterFullOtp", "Enter the full 6-digit OTP."));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const clean = cleanEmail();
      const exchange = await exchangeEmailOtp({ data: { email: clean, code } });
      if (!exchange.ok || !exchange.token) {
        setError(exchange.error ?? t("commerce.auth.otpInvalid", "That OTP is invalid or expired."));
        return;
      }
      const token = exchange.token;
      let res = await supabase.auth.verifyOtp({ email: clean, token, type: "email" });
      if (res.error || !res.data.session) {
        res = await supabase.auth.verifyOtp({ email: clean, token, type: "signup" });
      }
      if (res.error || !res.data.session) {
        setError(res.error?.message || t("commerce.auth.otpInvalid", "That OTP is invalid or expired."));
      } else {
        setNotice(null);
        onSignedIn?.(clean);
      }
    } catch {
      setError(t("commerce.auth.verifyFailed", "We could not verify the OTP. Please try again."));
    } finally {
      setBusy(false);
    }
  };


  const signInWithPassword = async () => {
    const clean = cleanEmail();
    if (!validEmail(clean)) {
      setError(t("commerce.auth.invalidEmail", "Enter a valid email address."));
      return;
    }
    if (password.length < 6) {
      setError(t("commerce.auth.enterPassword", "Enter your password."));
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });
      if (err || !data.session) {
        setError(
          err?.message === "Invalid login credentials"
            ? t("commerce.auth.credentialsMismatch", "That email and password do not match. If you have never set a password, sign in with an OTP instead.")
            : err?.message || t("commerce.auth.signInFailed", "We could not sign you in."),
        );
      } else {
        onSignedIn?.(clean);
      }
    } catch {
      setError(t("commerce.auth.signInRetry", "We could not sign you in. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: "otp" | "password") => {
    setMode(next);
    setError(null);
    setNotice(null);
    setCode("");
    setPassword("");
    setStage("email");
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="grid grid-cols-2 border hairline">
        {(["otp", "password"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`px-3 py-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold ${
              mode === m ? "bg-forest text-paper" : "bg-paper text-muted-foreground"
            }`}
          >
            {m === "otp" ? t("commerce.auth.emailOtp", "Email OTP") : t("commerce.auth.password", "Password")}
          </button>
        ))}
      </div>

      {mode === "otp" && stage === "email" && (
        <>
          <label className={labelCls}>{t("commerce.fields.email", "Email address")}</label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void sendCode(); } }}
            placeholder="you@example.com"
            className={inputCls}
          />
          <button type="button" onClick={() => void sendCode()} disabled={busy} className={btnCls}>
            {busy ? t("commerce.auth.sending", "Sending…") : t("commerce.auth.emailMeOtp", "Email me an OTP")}
          </button>
          <p className="text-[11px] text-muted-foreground">
            {t("commerce.auth.noPasswordNeeded", "No password needed. If you have never ordered with us, your account is created automatically.")}
          </p>
        </>
      )}

      {mode === "otp" && stage === "code" && (
        <>
          <label className={labelCls}>{t("commerce.auth.sixDigitOtp", "6-digit OTP")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              maxLength={6}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void verify(); } }}
              placeholder="000000"
              className={`${inputCls} flex-1 text-center font-mono text-lg tracking-[0.4em]`}
            />
            <button
              type="button"
              onClick={() => void verify()}
              disabled={busy || code.length !== 6}
              className="bg-forest text-paper px-6 text-xs uppercase tracking-[0.2em] font-semibold disabled:opacity-50"
            >
              {busy ? "…" : t("commerce.auth.verify", "Verify")}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em]">
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={busy || cooldown > 0}
              className="underline disabled:opacity-40"
            >
              {cooldown > 0 ? `${t("commerce.auth.resendIn", "Resend in")} ${cooldown}s` : t("commerce.auth.resendOtp", "Resend OTP")}
            </button>
            <button
              type="button"
              onClick={() => { setStage("email"); setCode(""); setError(null); setNotice(null); }}
              className="underline"
            >
              {t("commerce.auth.changeEmail", "Change email")}
            </button>
          </div>
        </>
      )}

      {mode === "password" && (
        <>
          <label className={labelCls}>{t("commerce.fields.email", "Email address")}</label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="you@example.com"
            className={inputCls}
          />
          <label className={labelCls}>{t("commerce.auth.password", "Password")}</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void signInWithPassword(); } }}
            placeholder="••••••••"
            className={inputCls}
            data-ltr
          />
          <button type="button" onClick={() => void signInWithPassword()} disabled={busy} className={btnCls}>
            {busy ? t("commerce.auth.signingIn", "Signing in…") : t("commerce.auth.signIn", "Sign in")}
          </button>
          <p className="text-[11px] text-muted-foreground">
            {t("commerce.auth.noPasswordYet", "No password yet? Sign in with an email OTP, then set a password from your account page.")}
          </p>
        </>
      )}

      {notice && !error && (
        <p className="border hairline bg-moss/5 px-3 py-2 text-xs text-muted-foreground">{notice}</p>
      )}
      {error && (
        <p className="border border-destructive bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
