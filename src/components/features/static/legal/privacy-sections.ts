import type { LegalSection } from "@/lib/legal";

export const privacySections: LegalSection[] = [
  {
    title: "Who We Are",
    html: `<p>greenwealth.com is operated by <strong>Ghori Trading LLC</strong>, a company registered in Dubai, United Arab Emirates, with its office at 2003, One by Omniyat Tower, Business Bay, Dubai. Ghori Trading LLC is the controller responsible for personal information collected through this website.</p>
<p>Orders placed in Saudi Riyal may be fulfilled by our affiliated establishment in the Kingdom of Saudi Arabia. Where this applies, that entity processes your order data solely for fulfilment and statutory record-keeping.</p>`,
  },
  {
    title: "What Information Do We Collect?",
    html: `<p>We gather the following categories of data:</p>
<ul>
<li><strong>Identity and contact data:</strong> your name, email address, phone number and, where applicable, company name.</li>
<li><strong>Order and delivery data:</strong> shipping and billing address, items purchased, quantities, currency, order value, delivery instructions, and tracking references.</li>
<li><strong>Payment data:</strong> the payment method type, transaction reference, authorisation result and currency. <strong>We never receive or store your full card number, expiry date or security code</strong> — these are captured directly by our payment processor.</li>
<li><strong>Account data:</strong> your email address, a hashed password if you choose to set one, one-time sign-in codes, and your saved address book derived from previous orders.</li>
<li><strong>Support and communication data:</strong> messages you send via our contact form, email, or WhatsApp, and our replies.</li>
<li><strong>Product verification data:</strong> batch or authenticity codes you submit on our verification page, together with the time and outcome of the check.</li>
<li><strong>Technical data collected automatically:</strong> IP address, device and browser type, operating system, referring URL, pages viewed, time on page, and error diagnostics.</li>
<li><strong>Marketing data:</strong> your newsletter subscription status and whether you opened or clicked our emails.</li>
</ul>
<p>We do not knowingly collect special-category data (such as health information) and ask that you do not submit it through our forms.</p>`,
  },
  {
    title: "How We Collect It",
    html: `<ul>
<li><strong>Directly from you</strong> — when you create an account, place an order, subscribe, contact support, submit a review, or verify a product.</li>
<li><strong>Automatically</strong> — through cookies and server logs when you browse the site. See our <a href="/cookie-policy">Cookie Policy</a>.</li>
<li><strong>From service providers</strong> — payment authorisation results from our processors and delivery status updates from couriers.</li>
</ul>`,
  },
  {
    title: "Why We Use Your Information",
    html: `<ul>
<li><strong>To fulfil your order:</strong> process payment, prepare the shipment, arrange courier collection, provide tracking, and handle returns or refunds.</li>
<li><strong>To operate your account:</strong> authenticate sign-in, display your order history, and maintain your saved addresses.</li>
<li><strong>To provide customer service:</strong> answer questions, investigate delivery issues, and process warranty or authenticity claims.</li>
<li><strong>To send service messages:</strong> order confirmations, dispatch and tracking notifications, and important account notices. These are not marketing and cannot be opted out of while an order is active.</li>
<li><strong>To send marketing:</strong> newsletters and offers, where you have subscribed or where permitted by law. You may unsubscribe at any time.</li>
<li><strong>To protect the store:</strong> detect and prevent fraud, counterfeit distribution, abuse of promotional codes, and security incidents.</li>
<li><strong>To improve the site:</strong> analyse aggregated usage, diagnose faults, and refine product information.</li>
<li><strong>To meet legal obligations:</strong> retain tax and commercial records and respond to lawful requests.</li>
</ul>`,
  },
  {
    title: "Legal Bases for Processing",
    html: `<p>Where data protection law requires a legal basis, we rely on:</p>
<ul>
<li><strong>Performance of a contract</strong> — to process and deliver your order and operate your account.</li>
<li><strong>Legitimate interests</strong> — to secure our platform, prevent fraud and counterfeiting, improve our services, and carry out aggregated analytics, balanced against your rights.</li>
<li><strong>Consent</strong> — for marketing communications and non-essential cookies. Consent may be withdrawn at any time.</li>
<li><strong>Legal obligation</strong> — to retain invoicing, tax, customs and accounting records.</li>
</ul>`,
  },
  {
    title: "Use of Cookies",
    html: '<p>We use cookies and similar technologies to keep your bag and session active, remember your currency and country, measure site performance, and understand which channels bring visitors to us. Full detail on each category, its lifespan, and how to control it is set out in our <a href="/cookie-policy">Cookie Policy</a>.</p>',
  },
  {
    title: "Sharing Your Data",
    html: `<p>We share personal information only where necessary, and only with recipients bound by confidentiality and security obligations:</p>
<ul>
<li><strong>Payment processors</strong> — to authorise and settle your transaction.</li>
<li><strong>Couriers and logistics partners</strong> — recipient name, address and phone number, so your parcel can be delivered and, where relevant, cleared through customs.</li>
<li><strong>Cloud hosting, database and email providers</strong> — to run the website and send transactional messages.</li>
<li><strong>Customer relationship and order management systems</strong> — our internal ERP and CRM platforms, used to process orders and provide support.</li>
<li><strong>Affiliated companies</strong> — on a need-to-know basis for fulfilment, accounting and support.</li>
<li><strong>Professional advisers and authorities</strong> — where required by law, court order, or to establish or defend legal claims.</li>
</ul>
<p><strong>We do not sell your personal data, and we do not rent or trade it to third parties for their own marketing.</strong></p>`,
  },
  {
    title: "International Transfers",
    html: "<p>We ship worldwide, and some of our service providers operate outside the United Arab Emirates. Where personal data is transferred internationally, we take reasonable steps to ensure it remains protected by an appropriate level of safeguards, including contractual confidentiality and security commitments with each provider. Delivery data must necessarily be shared with the courier and customs authorities of the destination country.</p>",
  },
  {
    title: "Data Retention",
    html: `<ul>
<li><strong>Order, invoice and tax records:</strong> retained for the period required by applicable commercial and tax law.</li>
<li><strong>Account data:</strong> retained while your account remains open, and for a limited period afterwards to resolve disputes.</li>
<li><strong>Support correspondence:</strong> typically retained for up to 24 months.</li>
<li><strong>Marketing data:</strong> retained until you unsubscribe, after which we keep a minimal suppression record so that we do not contact you again.</li>
<li><strong>One-time sign-in codes:</strong> valid for a short window and then invalidated.</li>
<li><strong>Technical logs:</strong> retained for a short period for security and diagnostics.</li>
</ul>
<p>When data is no longer needed it is deleted or irreversibly anonymised.</p>`,
  },
  {
    title: "Data Security",
    html: `<p>We take the protection of your data seriously. Our measures include encrypted connections (HTTPS) across the site, encryption of data in transit and at rest with our infrastructure providers, row-level access controls on our database, role-based access for staff, and the use of external processors for card data so that payment credentials never touch our systems.</p>
<p>No method of transmission or storage over the internet is completely secure, so we cannot guarantee absolute security. If you believe your account has been compromised, contact us immediately.</p>`,
  },
  {
    title: "Your Rights",
    html: `<p>Subject to applicable law, you may request to:</p>
<ul>
<li><strong>Access</strong> the personal data we hold about you.</li>
<li><strong>Correct</strong> inaccurate or incomplete details.</li>
<li><strong>Delete</strong> your data, where we are not required to retain it for legal or accounting reasons.</li>
<li><strong>Restrict or object to</strong> certain processing, including direct marketing.</li>
<li><strong>Withdraw consent</strong> at any time where processing is based on consent.</li>
<li><strong>Receive a copy</strong> of data you provided to us in a portable format.</li>
</ul>
<p>Write to <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a>. We may need to verify your identity before acting, and we aim to respond within 30 days.</p>`,
  },
  {
    title: "Children's Privacy",
    html: "<p>Our website and products are intended for adults. We do not knowingly collect personal information from children. If you believe a minor has provided us with data, contact us and we will delete it.</p>",
  },
  {
    title: "Third-Party Links",
    html: "<p>Our site and communications may link to third-party websites, social platforms or marketplaces. We do not control those services and are not responsible for their privacy practices. Please review their policies before providing information to them.</p>",
  },
  {
    title: "Limitation of Liability",
    html: "<p>To the maximum extent permitted by law, Ghori Trading LLC, along with its affiliates, partners, and employees, will not be responsible for any costs, damages, or liabilities arising from the collection, use, transfer, processing, or storage of personal information, other than as required by applicable law.</p>",
  },
  {
    title: "Governing Law and Jurisdiction",
    html: "<p>This policy is governed by the laws of the United Arab Emirates. Any dispute arising from it will be subject to the exclusive jurisdiction of the competent courts of Dubai, UAE, without prejudice to any mandatory consumer protections available to you locally.</p>",
  },
  {
    title: "Policy Updates",
    html: "<p>We may revise this policy from time to time to reflect changes in our operations, service providers, or the law. The current version is always published on this page and takes effect when posted. Material changes affecting how we use your data will be communicated where required.</p>",
  },
  {
    title: "Contact Information",
    html: `<p>If you have any questions or wish to exercise a right, please reach out:</p>
<p>Ghori Trading LLC<br/>2003, One by Omniyat Tower, Business Bay, Dubai, United Arab Emirates<br/>Privacy and legal: <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a><br/>Orders and support: <a href="mailto:sales@greenwealth.com">sales@greenwealth.com</a></p>`,
  },
];
