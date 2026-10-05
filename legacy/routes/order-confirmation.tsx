import { abs, localeOf, canonicalFor } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/order-confirmation")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const isAr = locale === "ar";
    return {
      meta: [
        { title: isAr ? "تم تأكيد الطلب — Green Wealth" : "Order Confirmed — Green Wealth" },
        {
          name: "description",
          content: isAr
            ? "شكرًا لطلبك من Green Wealth. غسول Neo Hair Lotion في طريقه إليك."
            : "Thank you for your Green Wealth order. Your Neo Hair Lotion is on its way.",
        },
        { name: "robots", content: "noindex, follow" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/order-confirmation", locale) }],
    };
  },
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const t = useT();
  const search = Route.useSearch() as { order?: string };
  return (
    <>
      <PageHeader eyebrow={t("commerce.confirmation.eyebrow", "Thank you")} title={t("commerce.confirmation.title", "Order confirmed")} />
      <div className="container-editorial py-10 md:py-20 max-w-2xl">
        <div className="border hairline p-8 md:p-12 bg-paper text-center">
          <h2 className="font-serif text-2xl mb-3">{t("commerce.confirmation.received", "Your order has been received")}</h2>
          {search.order ? (
            <p className="text-xs uppercase tracking-[0.2em] mb-6">
              {t("commerce.confirmation.reference", "Order reference")} · <span className="font-semibold">{search.order}</span>
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            {t(
              "commerce.confirmation.body",
              "A confirmation email is on its way with your order details, tracking information, and the 120-day protocol guide.",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/track-order" className="bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center">
              {t("commerce.confirmation.trackOrder", "Track your order")}
            </Link>
            <Link to="/how-to-use" className="border hairline px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center">
              {t("commerce.confirmation.readProtocol", "Read the protocol")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
