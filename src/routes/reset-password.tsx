import { localeOf, canonicalFor } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    return {
      meta: [
        { title: locale === "ar" ? "إعادة تعيين كلمة المرور — Green Wealth" : "Reset password — Green Wealth" },
        { name: "robots", content: "noindex, nofollow" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/reset-password", locale) }],
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const t = useT();
  return (
    <>
      <PageHeader eyebrow={t("commerce.resetPassword.eyebrow", "Account")} title={t("commerce.resetPassword.title", "Reset your password")} />
      <div className="container-editorial py-10 md:py-16 max-w-md">
        <form className="border hairline p-8 bg-paper space-y-4">
          <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ink/60 block">
            {t("commerce.fields.email", "Email address")}
          </label>
          <input type="email" data-ltr className="w-full border hairline h-11 px-3 focus:outline-none focus:border-forest" />
          <button type="button" className="w-full bg-forest text-paper h-11 text-xs uppercase tracking-[0.2em] font-semibold">
            {t("commerce.resetPassword.sendLink", "Send reset link")}
          </button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            {t("commerce.resetPassword.remembered", "Remembered?")}{" "}
            <Link to="/account" className="underline">{t("commerce.resetPassword.signIn", "Sign in")}</Link>
          </p>
        </form>
      </div>
    </>
  );
}
