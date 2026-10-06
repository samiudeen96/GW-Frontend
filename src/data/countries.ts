export type CountryLanding = {
  slug: string;
  name: string;
  currency: string;
  shippingDays: string;
  shippingNote: string;
  heroLine: string;
  cities: string[];
  testimonials: { name: string; city: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const countries: CountryLanding[] = [
  {
    slug: "uae",
    name: "United Arab Emirates",
    currency: "AED",
    shippingDays: "1–3 business days",
    shippingNote:
      "Delivered from our authorised UAE distribution partner. Free shipping over AED 300.",
    heroLine: "Trusted by thousands across the Emirates for authentic Green Wealth hair care.",
    cities: [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain",
      "Al Ain",
    ],
    testimonials: [
      {
        name: "Sara A.",
        city: "Dubai Marina",
        body: "Ordered in the morning, arrived next day. The scratch code verified instantly — this is the real Neo Hair Lotion.",
      },
      {
        name: "Mohammed R.",
        city: "Abu Dhabi",
        body: "Three months in and my hairline is visibly denser. Green Wealth in the UAE is legit.",
      },
      {
        name: "Layla H.",
        city: "Sharjah",
        body: "Bought the bundle with shampoo and rosemary oil — noticeable difference in shine within weeks.",
      },
    ],
    faqs: [
      {
        q: "Do you deliver across the UAE?",
        a: "Yes — all seven emirates, typically within 1–3 business days from our authorised distributor.",
      },
      {
        q: "Is cash on delivery available?",
        a: "Yes, COD is supported for UAE orders alongside card and Apple Pay.",
      },
      {
        q: "How do I confirm my product is authentic?",
        a: "Every bottle carries a scratch code. Enter it on our Authenticity Check page for instant verification.",
      },
    ],
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    currency: "SAR",
    shippingDays: "2–5 business days",
    shippingNote:
      "Shipped from our authorised regional partner. Nationwide coverage across all provinces.",
    heroLine: "Authentic Green Wealth Neo Hair Lotion delivered across the Kingdom.",
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Taif", "Tabuk"],
    testimonials: [
      {
        name: "Abdullah K.",
        city: "Riyadh",
        body: "Fast delivery to Riyadh and the product is the original from Thailand. Very happy.",
      },
      {
        name: "Fatima M.",
        city: "Jeddah",
        body: "The rosemary oil combined with Neo Hair Lotion gave me the best results in a year.",
      },
      {
        name: "Omar S.",
        city: "Dammam",
        body: "Bought from Green Wealth after being burned by fakes on other sites. Real deal, verified code.",
      },
    ],
    faqs: [
      {
        q: "Do you ship to all of KSA?",
        a: "Yes, we cover every major city and most towns across the Kingdom.",
      },
      {
        q: "What payment methods work in Saudi Arabia?",
        a: "Mada, Visa, Mastercard, Apple Pay, and cash on delivery in select cities.",
      },
      {
        q: "Is the product the original from Thailand?",
        a: "Yes — genuine Green Wealth Neo Hair Lotion® manufactured to original specification, distributed under authorisation.",
      },
    ],
  },
  {
    slug: "qatar",
    name: "Qatar",
    currency: "QAR",
    shippingDays: "2–4 business days",
    shippingNote: "Delivered across Qatar from our regional partner.",
    heroLine: "Authentic hair care, verified batch by batch, delivered to your door in Qatar.",
    cities: ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Umm Salal"],
    testimonials: [
      {
        name: "Ahmed N.",
        city: "Doha",
        body: "Genuine product, careful packaging, quick delivery. Will reorder.",
      },
      {
        name: "Noora Q.",
        city: "Al Rayyan",
        body: "The shampoo is gentle and pairs perfectly with the Neo lotion.",
      },
    ],
    faqs: [
      {
        q: "How long does delivery take in Qatar?",
        a: "Typically 2–4 business days after dispatch.",
      },
      { q: "Do you accept QAR?", a: "Yes, prices display in Qatari Riyal automatically." },
    ],
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    currency: "KWD",
    shippingDays: "2–5 business days",
    shippingNote: "Nationwide delivery across Kuwait through our authorised partner.",
    heroLine: "Genuine Green Wealth range, priced in KWD, delivered across Kuwait.",
    cities: ["Kuwait City", "Hawalli", "Salmiya", "Al Ahmadi", "Farwaniya"],
    testimonials: [
      {
        name: "Yousef B.",
        city: "Kuwait City",
        body: "Fast delivery and the scratch code checked out. Very satisfied.",
      },
      {
        name: "Mariam A.",
        city: "Salmiya",
        body: "Great customer support in Arabic. Product works.",
      },
    ],
    faqs: [
      {
        q: "Is cash on delivery available?",
        a: "Yes, COD is supported in Kuwait alongside K-Net and card payments.",
      },
    ],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    currency: "GBP",
    shippingDays: "3–7 business days",
    shippingNote: "Tracked shipping to England, Scotland, Wales and Northern Ireland.",
    heroLine: "Bringing the botanical hair-care ritual trusted across Asia to the UK.",
    cities: [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Glasgow",
      "Edinburgh",
      "Bristol",
      "Belfast",
    ],
    testimonials: [
      {
        name: "James P.",
        city: "London",
        body: "Landed in five days, sealed properly, code verified online. Impressed.",
      },
      {
        name: "Priya D.",
        city: "Manchester",
        body: "Bought Neo Hair Lotion after seeing reviews — one bottle in, hair feels thicker.",
      },
      { name: "Aisha B.", city: "Birmingham", body: "UK stock and real product. That's rare." },
    ],
    faqs: [
      {
        q: "Are prices inclusive of UK VAT?",
        a: "Yes, all UK prices are shown inclusive of applicable taxes.",
      },
      {
        q: "Do you ship to Northern Ireland?",
        a: "Yes, we deliver to all UK addresses including NI.",
      },
    ],
  },
  {
    slug: "india",
    name: "India",
    currency: "INR",
    shippingDays: "5–10 business days",
    shippingNote: "Shipped internationally with tracked delivery to every major Indian city.",
    heroLine: "The original Green Wealth Neo Hair Lotion®, delivered to your door in India.",
    cities: [
      "Mumbai",
      "Delhi",
      "Bengaluru",
      "Hyderabad",
      "Chennai",
      "Kolkata",
      "Pune",
      "Ahmedabad",
    ],
    testimonials: [
      {
        name: "Rohit S.",
        city: "Mumbai",
        body: "Genuine product, tracked all the way. Bald patches filling in after 3 months.",
      },
      {
        name: "Anita R.",
        city: "Bengaluru",
        body: "Way better than local knock-offs on marketplaces. This is the real Thai formula.",
      },
      {
        name: "Vikram J.",
        city: "Delhi NCR",
        body: "Delivery took a week but worth the wait. Highly recommended.",
      },
    ],
    faqs: [
      {
        q: "Are customs duties included?",
        a: "Import duties are handled at delivery where applicable; the checkout total covers product and shipping.",
      },
      {
        q: "Which cities do you deliver to?",
        a: "All major Indian cities and most Tier-2 towns via our international courier partner.",
      },
    ],
  },
];

export const countryBySlug = (slug: string) => countries.find((c) => c.slug === slug);
