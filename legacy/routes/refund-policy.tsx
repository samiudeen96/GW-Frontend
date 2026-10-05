import { createFileRoute } from "@tanstack/react-router";
import { breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { PageHeader } from "@/components/site/Page";
import { LegalSections, type LegalSection } from "@/components/site/LegalSections";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { useLegalSections } from "@/lib/i18n/legal";

const sections: LegalSection[] = [
  {
    title: "Return Window",
    html: `<p>We operate a <strong>7-day return policy</strong>. You have 7 calendar days from the date your parcel is delivered to notify us that you wish to return an item. Requests received after this window cannot be accepted, other than for defective or incorrectly supplied goods, which are covered separately below.</p>
<p>The delivery date is taken from the courier's proof-of-delivery record.</p>`,
  },
  {
    title: "Eligibility Conditions",
    html: `<p>To be eligible for a return, the item must be:</p>
<ul>
<li>In the <strong>same condition in which you received it</strong> — unopened, unworn and unused.</li>
<li>In its <strong>original packaging</strong>, with all seals, authenticity stickers, batch labels, outer cartons and inserts intact.</li>
<li>Accompanied by the <strong>receipt or proof of purchase</strong> and the order number.</li>
</ul>
<p>Because these are topical cosmetic products, any item whose seal or authenticity sticker has been broken, or which shows signs of use, cannot be resold and is therefore not returnable on a change-of-mind basis. This does not affect your rights where a product is faulty.</p>`,
  },
  {
    title: "How to Start a Return",
    html: `<ol>
<li>Email <a href="mailto:sales@greenwealth.com">sales@greenwealth.com</a> within 7 days of delivery with your order number, the item(s) concerned, and the reason for the return.</li>
<li>Our team will review the request and, if accepted, reply with a <strong>return-acceptance email</strong> confirming the return address.</li>
<li>Ship the item back using any courier of your choice, packing it securely and including a printed copy of the return-acceptance email inside the parcel.</li>
<li>Send us the outbound tracking number so we can monitor the shipment.</li>
</ol>
<p>Items sent back without first requesting and receiving a return acceptance cannot be processed and may be returned to you at your cost.</p>`,
  },
  {
    title: "Return Shipping Costs",
    html: `<ul>
<li><strong>Change of mind:</strong> return shipping, and any duties or taxes arising on the return leg, are the customer's responsibility. Original outbound shipping charges are non-refundable.</li>
<li><strong>Defective, damaged, or incorrect item:</strong> we cover the cost of return or replacement. Do not incur return shipping costs before contacting us — unapproved charges cannot be reimbursed.</li>
</ul>
<p>We recommend using a trackable service. We cannot process a refund for a return we do not receive.</p>`,
  },
  {
    title: "Damages and Issues",
    html: `<p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged in transit, or if you received the wrong item, so we can evaluate the issue and make it right.</p>
<p>To allow us to raise a claim with the courier, please include:</p>
<ul>
<li>Clear photographs of the product showing the defect or damage.</li>
<li>Photographs of the outer packaging from all sides.</li>
<li>A photograph of the shipping label or slip showing the tracking number.</li>
<li>A short video where the issue is easier to demonstrate in motion, such as a leak.</li>
</ul>
<p>Please report transit damage <strong>within 48 hours of delivery</strong>, as courier claim windows are short.</p>`,
  },
  {
    title: "Exceptions / Non-Returnable Items",
    html: `<p>Certain items cannot be returned:</p>
<ul>
<li><strong>Custom or personalised products</strong>, including special orders and bulk or wholesale consignments prepared to your specification.</li>
<li><strong>Accessories with a hygiene function</strong>, such as the Dermaroller, once the sterile packaging has been opened.</li>
<li><strong>Opened or used cosmetic products</strong>, for health and hygiene reasons.</li>
<li><strong>Sale, clearance and promotional items</strong>, and <strong>gift cards</strong>.</li>
<li><strong>Free items or bundle components</strong> received as part of a promotion, unless the whole bundle is returned.</li>
</ul>
<p>Please get in touch if you have a question about a specific item — we will always tell you before you ship anything back.</p>`,
  },
  {
    title: "Exchanges",
    html: "<p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. Where a direct exchange is possible we will confirm this in writing, including any price difference payable or refundable.</p>",
  },
  {
    title: "Order Cancellations",
    html: "<p>You may cancel an order free of charge at any time before it has been dispatched — simply email us with your order number. Once the parcel has been handed to the courier the order can no longer be cancelled, and it must instead be handled as a return under this policy. For prepaid cancellations, the full amount, including shipping, is refunded to the original payment method.</p>",
  },
  {
    title: "Refunds: Inspection and Approval",
    html: `<p>We will notify you once we have received and inspected your return, and let you know whether the refund was approved.</p>
<ul>
<li>Inspection normally takes <strong>2–5 business days</strong> from receipt at our warehouse.</li>
<li>If a returned item does not meet the eligibility conditions above, we will contact you with photographic evidence and offer to return it to you at your cost.</li>
<li>Where an item is returned in a diminished condition, we may apply a proportionate reduction to the refund.</li>
</ul>`,
  },
  {
    title: "Refunds: Method and Timing",
    html: `<ul>
<li>Approved refunds are issued to the <strong>original payment method</strong>. We cannot refund to a different card, account or person.</li>
<li>We process approved refunds within <strong>5 business days</strong> of approval.</li>
<li>Your bank or card issuer may take a further <strong>5–15 business days</strong> to post the funds to your statement. This period is outside our control.</li>
<li>Refunds are issued in the <strong>original currency of the transaction</strong>. Any variation in the amount you receive due to exchange-rate movement or bank fees is a matter between you and your payment provider.</li>
<li><strong>Cash-on-delivery orders</strong> are refunded by bank transfer to an account in the purchaser's name, once verified.</li>
<li>Where a return was accepted as a courtesy outside the standard conditions, a <strong>store credit or coupon code</strong> may be issued instead of a cash refund.</li>
</ul>`,
  },
  {
    title: "Duties, Taxes and Shipping on Refunds",
    html: "<p>Original outbound shipping charges are non-refundable except where the return arises from our error or a defective product. Import duties or taxes paid to the authorities of the destination country are collected by that government, not by us; where a refund of those charges is available, it must be claimed directly from the relevant customs or tax authority.</p>",
  },
  {
    title: "Non-Delivery, Refused and Undeliverable Parcels",
    html: `<ul>
<li><strong>Lost in transit:</strong> once the courier confirms the parcel is lost, we will replace or refund the order in full.</li>
<li><strong>Refused on delivery or unclaimed:</strong> parcels refused without cause, or returned because of an incorrect or incomplete address, or because customs charges were not paid, are refunded less the outbound shipping, any return-freight charges and any duties incurred.</li>
<li><strong>Failed delivery attempts:</strong> please respond to courier notifications promptly; storage and re-delivery fees charged by the courier are passed on to the customer.</li>
</ul>`,
  },
  {
    title: "Counterfeit and Authenticity Claims",
    html: "<p>Every unit we ship carries an authenticity sticker with a verification code that can be checked on our <a href=\"/verify\">verification page</a>. If a code you received from us does not validate, stop using the product and contact us immediately with photographs of the sticker and the batch details — we will investigate and, where the claim is confirmed, replace or refund the item in full. We cannot accept claims for products purchased from unauthorised sellers or other marketplaces.</p>",
  },
  {
    title: "Wholesale and Bulk Orders",
    html: "<p>Wholesale, distributor and bulk consignments are sold on agreed commercial terms and are not covered by the change-of-mind provisions of this policy. Claims for short shipment, transit damage or manufacturing defects must be raised within 7 days of receipt, supported by photographs and a packing reconciliation. See our <a href=\"/wholesale\">wholesale page</a> for enquiries.</p>",
  },
  {
    title: "Consumer Rights",
    html: "<p>Nothing in this policy limits any statutory rights you may have under the consumer protection laws of the United Arab Emirates or of your country of residence, including rights relating to goods that are faulty, not as described, or unfit for purpose.</p>",
  },
  {
    title: "Contact and Escalation",
    html: `<p>For all returns, refunds and claims:</p>
<p>Ghori Trading LLC<br/>2003, One by Omniyat Tower, Business Bay, Dubai, United Arab Emirates<br/>Orders and returns: <a href="mailto:sales@greenwealth.com">sales@greenwealth.com</a><br/>Escalation and legal: <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a></p>
<p>Please quote your order number in all correspondence. See also our <a href="/shipping-returns">Shipping Policy</a> and <a href="/terms">Terms of Service</a>.</p>`,
  },
];

const EN = {
  eyebrow: "Legal",
  title: "Refund Policy",
  intro:
    "This policy explains when an item can be returned, how to request a return, who pays for return shipping, how we inspect returned goods, and how and when refunds are issued. It applies to all purchases made on greenwealth.com.",
  seoTitle: "Refund Policy — Green Wealth",
  seoDescription:
    "Our detailed 7-day return and refund policy: eligibility, how to start a return, shipping costs, inspection, refund timing, exceptions and authenticity claims.",
  ogTitle: "Refund Policy — Green Wealth",
  ogDescription:
    "7-day return window, refund method and timing, non-returnable items, damage claims and cancellations for greenwealth.com orders.",
};

export const Route = createFileRoute("/refund-policy")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    return {
      meta: [
        { title: t("legal.refund.seo.title", EN.seoTitle) },
        { name: "description", content: t("legal.refund.seo.description", EN.seoDescription) },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: t("legal.refund.seo.ogTitle", EN.ogTitle) },
        { property: "og:description", content: t("legal.refund.seo.ogDescription", EN.ogDescription) },
      ],
      links: [
        { rel: "canonical", href: canonicalFor("/refund-policy", locale) },
        ...hreflangLinks("/refund-policy"),
      ],
      scripts: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Refund Policy", path: "/refund-policy" }])],
    };
  },
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  const t = useT();
  const localized = useLegalSections("refund", sections);
  return (
    <>
      <PageHeader eyebrow={t("legal.refund.eyebrow", EN.eyebrow)} title={t("legal.refund.title", EN.title)} />
      <LegalSections intro={t("legal.refund.intro", EN.intro)} sections={localized} numbered />
    </>
  );
}
