/**
 * Account body island: resolves the session, then shows the sign-in card
 * (signed out) or the account dashboard (signed in). Needs the
 * `commerce.account`, `commerce.auth`, `commerce.fields`, `commerce.tracking`
 * prefixes (+ a few `trackOrder`/`summary`/`payment` keys) in `i18n`.
 */
import { useCallback, useEffect, useState } from "react";

import { EmailOtpSignIn } from "@/components/react/EmailOtpSignIn";
import { getAccountSession, type AccountSession } from "@/lib/api/account";
import { signOut } from "@/lib/api/auth";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";

import { AccountDashboard } from "./AccountDashboard";

type Props = { i18n: IslandI18n };

function Portal() {
  const { t } = useI18n();
  const [session, setSession] = useState<AccountSession | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      setSession(await getAccountSession());
    } catch {
      setSession({ signedIn: false });
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const handleSignOut = async () => {
    await signOut();
    setSession({ signedIn: false });
  };

  if (!session) {
    return (
      <p className="text-center text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {t("commerce.account.checkingSession", "Checking session…")}
      </p>
    );
  }

  return session.signedIn ? (
    <AccountDashboard email={session.user.email} onSignOut={() => void handleSignOut()} />
  ) : (
    <SignedOut onSignedIn={() => void refreshSession()} />
  );
}

function SignedOut({ onSignedIn }: { onSignedIn: () => void }) {
  const { t, path } = useI18n();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="border hairline bg-paper p-8 md:p-12">
        <div className="mx-auto max-w-sm">
          <h2 className="mb-2 text-center font-serif text-2xl">
            {t("commerce.account.signIn.title", "Sign in")}
          </h2>
          <p className="mb-6 text-center text-xs text-muted-foreground">
            {t(
              "commerce.account.signIn.subtitle",
              "Choose an emailed 6-digit code or your password.",
            )}
          </p>
          <EmailOtpSignIn onSignedIn={onSignedIn} />
        </div>
      </div>
      <div className="mt-6 border hairline bg-paper p-6 text-center md:p-8">
        <h3 className="mb-2 text-xs font-bold tracking-[0.18em] uppercase">
          {t("commerce.account.lookup.title", "Order lookup without signing in")}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {t(
            "commerce.account.lookup.body",
            "Use your order number with the email or phone from checkout.",
          )}
        </p>
        <a
          href={path("/track-order")}
          className="text-xs font-semibold tracking-[0.18em] uppercase underline"
        >
          {t("commerce.account.lookup.cta", "Go to order tracking")}
        </a>
      </div>
    </div>
  );
}

export default function AccountPortal({ i18n }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Portal />
    </I18nProvider>
  );
}
