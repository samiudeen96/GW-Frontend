import { createFileRoute } from "@tanstack/react-router";
import { breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { PageHeader } from "@/components/site/Page";
import { LegalSections, type LegalSection } from "@/components/site/LegalSections";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { useLegalSections } from "@/lib/i18n/legal";

const sections: LegalSection[] = [
  {
    title: "General",
    html: `<p>We strive to keep our stock levels updated, but in rare cases there may be a discrepancy between the availability shown online and our warehouse position. If we cannot fulfil every item in your order, our team will contact you with an update and alternative solutions — a partial dispatch, a substitution, a short wait for restock, or a refund of the unavailable line.</p>
<p>All orders are subject to verification of the delivery address and, for higher-value or cash-on-delivery orders, confirmation by phone, email or WhatsApp before dispatch.</p>`,
  },
  {
    title: "Order Processing and Dispatch",
    html: `<ul>
<li><strong>Order cut-off:</strong> orders confirmed on a business day are picked the same or next working day. Weekends and UAE public holidays are not business days.</li>
<li><strong>Dispatch time:</strong> we aim to dispatch within <strong>2 business days</strong> of receiving cleared payment or confirming a cash-on-delivery order.</li>
<li><strong>Verification holds:</strong> orders flagged by our fraud checks, or with an incomplete address or unreachable phone number, are held until confirmed. This can add 1–2 business days.</li>
<li><strong>Confirmation:</strong> you receive an order confirmation email immediately, and a dispatch email with tracking once the parcel is collected by the courier.</li>
</ul>`,
  },
  {
    title: "Shipping Costs",
    html: `<p>Shipping costs are calculated at checkout based on the weight, size and destination of the shipment, and are shown in full before you pay. Charges added at the time of purchase are final.</p>
<ul>
<li>Rates vary by country and by courier service level.</li>
<li>Remote or out-of-area postcodes may attract a courier surcharge; where this applies we will contact you before dispatch.</li>
<li>Any promotional free-shipping threshold applies to the merchandise subtotal, in the currency shown, and excludes duties and taxes.</li>
</ul>`,
  },
  {
    title: "Delivery Terms",
    html: `<ul>
<li><strong>Domestic transit time:</strong> local deliveries within the UAE and across GCC countries typically arrive within <strong>2–5 business days</strong>.</li>
<li><strong>International transit time:</strong> international orders generally take <strong>7–10 business days</strong>, and longer where customs inspection is required.</li>
<li><strong>Dispatch time:</strong> we aim to dispatch orders within 2 business days of payment.</li>
<li><strong>Estimates only:</strong> all transit times are courier estimates, not guarantees. Weather, customs, strikes, public holidays and peak season volumes can extend them.</li>
<li><strong>Change of delivery address:</strong> you can update your delivery address by contacting us by email before dispatch. Once a parcel is in transit, address changes depend entirely on the courier and may incur a fee.</li>
<li><strong>P.O. Box shipping:</strong> we ship to P.O. boxes using postal services, for prepaid orders only.</li>
<li><strong>Out-of-stock items:</strong> if an item is unavailable we will contact you and, unless you instruct otherwise, wait for restock before dispatching the order together.</li>
<li><strong>Delivery delays:</strong> if your order exceeds the expected delivery window, contact us with your order number and we will open an enquiry with the courier.</li>
</ul>`,
  },
  {
    title: "Tracking Your Order",
    html: `<p>Every shipment is dispatched with a tracking number. You can follow your parcel in three ways:</p>
<ul>
<li>The tracking link in your dispatch email.</li>
<li>Our <a href="/track-order">track order</a> page, using your order number and email.</li>
<li>The order detail view inside your <a href="/account">account</a>.</li>
</ul>
<p>Tracking can take up to 24 hours after dispatch to show its first scan while the parcel is processed at the courier hub.</p>`,
  },
  {
    title: "Import Duties and Taxes",
    html: `<ul>
<li><strong>Sales tax / VAT:</strong> where applicable, this is included in the price of the goods displayed on our website.</li>
<li><strong>Import duties and taxes:</strong> may apply on arrival for international orders and vary by destination country. These charges are levied by the destination government, are <strong>the customer's responsibility</strong>, and are not included in the price or shipping charge you pay us.</li>
<li><strong>Customs documentation:</strong> we declare shipments accurately and at full value as required by law. We cannot mark parcels as gifts or under-declare value.</li>
<li><strong>Refused charges:</strong> if duties are not paid and the parcel is returned or destroyed, the refund is handled under the undeliverable-parcel terms below.</li>
</ul>`,
  },
  {
    title: "Restricted Destinations and Compliance",
    html: "<p>Some countries restrict the import of cosmetic products, or require registration, quantity limits or an import permit. It is the customer's responsibility to ensure the products ordered may lawfully be imported into the destination country. We may cancel and refund an order where we cannot ship compliantly, or where the destination is subject to sanctions or courier embargoes.</p>",
  },
  {
    title: "Damaged Parcels",
    html: "<p>If your parcel arrives visibly damaged, please <strong>reject it upon delivery</strong> and contact us immediately. If it was delivered in your absence, contact us within 48 hours with photographs of the damaged shipment, the product and all sides of the packaging, plus the shipping label, so we can raise a courier claim and assist you.</p>",
  },
  {
    title: "Insurance, Loss and Claims",
    html: `<ul>
<li><strong>Damaged parcels:</strong> we will replace or refund your order once the courier completes their investigation, which typically takes <strong>7–10 business days</strong>.</li>
<li><strong>Lost parcels:</strong> a refund or replacement is processed once the courier formally confirms the package as lost. Couriers usually require a parcel to be missing for 10–21 days before declaring loss.</li>
<li><strong>Claim requirements:</strong> photographic evidence and the original tracking number are required for every claim.</li>
<li><strong>Marked as delivered but not received:</strong> contact us within 7 days. We will request the proof of delivery and GPS record from the courier and investigate with them.</li>
</ul>`,
  },
  {
    title: "Returns",
    html: `<p>We accept returns due to change of mind within <strong>7 days</strong> of receiving your order. Items must be in their original packaging, unused, sealed and in a condition suitable for resale. Return shipping is the customer's responsibility.</p>
<p>Once we receive and approve the return, a refund, store credit or coupon code will be issued as set out in our <a href="/refund-policy">Refund Policy</a>. Outbound shipping costs are non-refundable on change-of-mind returns.</p>
<p>Do not ship anything back before requesting a return and receiving our return-acceptance email.</p>`,
  },
  {
    title: "Cancellations",
    html: "<p>You may cancel your order at any time before dispatch at no charge. If the order has already been shipped, please refer to our <a href=\"/refund-policy\">return policy</a>. We also reserve the right to cancel and refund an order where the item is unavailable, the address cannot be verified, the destination cannot be served compliantly, or the order appears fraudulent.</p>",
  },
  {
    title: "Wholesale and Bulk Shipments",
    html: "<p>Wholesale, distributor and pallet consignments are quoted individually, since freight mode, incoterms, lead time and documentation differ from retail parcels. Transit times, insurance and duty responsibility for these shipments are governed by the quotation and commercial terms agreed in writing. Enquire via our <a href=\"/wholesale\">wholesale page</a>.</p>",
  },
  {
    title: "Customer Service",
    html: `<p>For any enquiry or concern about a shipment:</p>
<p>Ghori Trading LLC<br/>2003, One by Omniyat Tower, Business Bay, Dubai, United Arab Emirates<br/>Orders and shipping: <a href="mailto:sales@greenwealth.com">sales@greenwealth.com</a></p>
<p>Please include your order number and tracking reference so we can respond quickly.</p>`,
  },
];

const EN = {
  eyebrow: "Legal",
  title: "Shipping Policy",
  intro:
    "Welcome to the shipping policy of Ghori Trading LLC. It sets out how orders are processed and dispatched, how shipping is charged, expected transit times, how to track a parcel, how customs duties are handled, and what happens if a shipment is delayed, damaged or lost. By placing an order through our website, you agree to the terms outlined here.",
  seoTitle: "Shipping Policy — Green Wealth",
  seoDescription:
    "Green Wealth shipping costs, dispatch and transit times, tracking, customs duties, damaged or lost parcel claims, and the return process for orders worldwide.",
  ogTitle: "Shipping Policy — Green Wealth",
  ogDescription:
    "Dispatch times, delivery estimates, tracking, duties and taxes, damage and loss claims for greenwealth.com orders.",
};

export const Route = createFileRoute("/shipping-returns")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    return {
      meta: [
        { title: t("legal.shipping.seo.title", EN.seoTitle) },
        { name: "description", content: t("legal.shipping.seo.description", EN.seoDescription) },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: t("legal.shipping.seo.ogTitle", EN.ogTitle) },
        { property: "og:description", content: t("legal.shipping.seo.ogDescription", EN.ogDescription) },
      ],
      links: [
        { rel: "canonical", href: canonicalFor("/shipping-returns", locale) },
        ...hreflangLinks("/shipping-returns"),
      ],
      scripts: [
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Shipping & Returns", path: "/shipping-returns" }]),
      ],
    };
  },
  component: ShippingPage,
});

function ShippingPage() {
  const t = useT();
  const localized = useLegalSections("shipping", sections);
  return (
    <>
      <PageHeader eyebrow={t("legal.shipping.eyebrow", EN.eyebrow)} title={t("legal.shipping.title", EN.title)} />
      <LegalSections intro={t("legal.shipping.intro", EN.intro)} sections={localized} numbered />
    </>
  );
}
