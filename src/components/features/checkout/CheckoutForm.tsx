/**
 * Checkout: contact, shipping country/address (country-aware state + postal
 * validation), delivery method, payment method, notes and the order summary.
 *
 * - SAR + card goes to Moyasar's hosted page via `startSarPayment`.
 * - Every other method records the order with `placeOrder`, clears the bag and
 *   redirects to `/order-confirmation`.
 * Both are API placeholders today, so submitting shows their error message.
 *
 * Picking a country that implies another supported currency switches the
 * currency (cookie + reload); the form is kept in sessionStorage across it.
 */
import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef, useState, type ReactNode, type SubmitEvent } from "react";

import {
  ALL_COUNTRIES,
  COUNTRY_PHONE_CODES,
  COUNTRY_STATES,
  NO_ZIP_COUNTRIES,
  STATE_LABELS,
  STATE_REQUIRED_COUNTRIES,
  ZIP_PATTERNS,
} from "@/data/countryStateData";
import { resolveShipping } from "@/data/shipping";
import { signOut } from "@/lib/api/auth";
import { placeOrder } from "@/lib/api/orders";
import { startSarPayment, type CheckoutOrder } from "@/lib/api/payments";
import { tierUnitPrice, type CartCatalog } from "@/lib/cart-types";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import { formatMoney, getCurrency, isCurrency } from "@/lib/pricing";
import { $cartItems, clearCart } from "@/lib/stores/cart";
import { setCurrency } from "@/lib/stores/currency";
import { EmailOtpSignIn } from "@/components/react/EmailOtpSignIn";

import { Field, inputCls, PayTab, Section, ShipOption, SubmitButton } from "./CheckoutParts";
import { LoadingBlock } from "./PageHeading";
import { useHydrated } from "./useHydrated";

type Props = {
  i18n: IslandI18n;
  catalog: CartCatalog;
  currency: string;
  /** Image title attributes by product slug. */
  imageTitles: Record<string, string>;
  /** Astro slot `quote`: `<CustomerQuote compact />`. */
  quote?: ReactNode;
};

/* Cash-on-delivery handling fee (India only, matches GW: ₹100) */
const COD_FEE: Record<string, number> = { INR: 100 };

/* Country → currency hint (best-effort autoselect) */
const COUNTRY_CURRENCY: Record<string, string> = {
  AE: "AED",
  SA: "SAR",
  KW: "KWD",
  QA: "QAR",
  BH: "BHD",
  OM: "OMR",
  IN: "INR",
  PK: "PKR",
  AF: "AFN",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
};

/* GCC + COD availability */
const GCC = new Set(["AE", "SA", "KW", "QA", "BH", "OM"]);
const COD_COUNTRIES = new Set([...GCC, "IN", "PK", "AF"]);

const DEFAULT_COUNTRY = "AE";
const PROMO_CODE = "GW10";
const DRAFT_KEY = "gw_checkout_draft_v1";

type ShipMethod = "standard" | "express";
type PayMethod = CheckoutOrder["paymentMethod"];

type Form = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal: string;
  countryCode: string; // ISO
  notes: string;
  coupon: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const INITIAL: Form = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postal: "",
  countryCode: DEFAULT_COUNTRY,
  notes: "",
  coupon: "",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvc: "",
};

type Draft = {
  form: Form;
  ship: ShipMethod;
  pay: PayMethod;
  couponApplied: string | null;
};

const toTitleCase = (str: string) =>
  str.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
const normalizePhone = (val: string) => val.replace(/^0+/, "");

/** Draft saved right before a currency-switch reload (card details are never stored). */
function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Draft>;
    if (!d.form || typeof d.form.countryCode !== "string") return null;
    return {
      form: { ...INITIAL, ...d.form, cardNumber: "", cardName: "", cardExpiry: "", cardCvc: "" },
      ship: d.ship === "express" ? "express" : "standard",
      pay: d.pay === "cod" || d.pay === "pay_on_site" ? d.pay : "card",
      couponApplied: d.couponApplied === PROMO_CODE ? PROMO_CODE : null,
    };
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft) {
  try {
    const form = { ...draft.form, cardNumber: "", cardName: "", cardExpiry: "", cardCvc: "" };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, form }));
  } catch {
    /* storage unavailable */
  }
}

/** Starting state: a saved draft, else the country matching the active currency. */
function initialDraft(currency: string): Draft {
  const draft = readDraft();
  if (draft) return draft;
  const country =
    Object.keys(COUNTRY_CURRENCY).find((code) => COUNTRY_CURRENCY[code] === currency) ??
    DEFAULT_COUNTRY;
  return {
    form: { ...INITIAL, countryCode: country },
    ship: "standard",
    pay: "card",
    couponApplied: null,
  };
}

function Checkout({ catalog, currency, imageTitles, quote }: Omit<Props, "i18n">) {
  const { t, path } = useI18n();
  const hydrated = useHydrated();
  const items = useStore($cartItems);
  const curMeta = getCurrency(currency);

  const [init] = useState(() => initialDraft(currency));
  const [form, setForm] = useState<Form>(init.form);
  const [ship, setShip] = useState<ShipMethod>(init.ship);
  const [pay, setPay] = useState<PayMethod>(init.pay);
  const [couponApplied, setCouponApplied] = useState<string | null>(init.couponApplied);
  const [submitting, setSubmitting] = useState(false);
  const [switchingCurrency, setSwitchingCurrency] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [pincodeLooking, setPincodeLooking] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  // TODO(api): read the signed-in customer from the backend session (and their
  // saved address book). Until then every shopper starts as a guest.
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const payErrorRef = useRef<HTMLDivElement>(null);

  /* The draft only bridges a currency-switch reload. */
  useEffect(() => {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  /* Bring a payment / order error into view (it sits above the submit button). */
  useEffect(() => {
    if (payError) payErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [payError]);

  /* SAR card / mada is processed by Moyasar's hosted page (no card data on-site) */
  const isMoyasar = currency === "SAR" && pay === "card";

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const clearErr = (k: keyof Form) =>
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });

  /* Derived country context */
  const cc = form.countryCode;
  const phoneCode = COUNTRY_PHONE_CODES[cc] || "";
  const showZip = !NO_ZIP_COUNTRIES.has(cc);
  const stateOptions = COUNTRY_STATES[cc] || [];
  const stateRequired = STATE_REQUIRED_COUNTRIES.has(cc);
  const stateLabel = STATE_LABELS[cc] || "State / Region";

  /* Payment availability per country */
  const codAvailable = COD_COUNTRIES.has(cc);
  const payOnSiteAvailable = cc === "AE";
  const cardAvailable = cc !== "IN"; // GW routes IN to Razorpay

  /* Country change: reset an invalid state and switch to the implied currency. */
  const changeCountry = (code: string) => {
    const options = COUNTRY_STATES[code] || [];
    const next: Form = {
      ...form,
      countryCode: code,
      state: options.length > 0 && !options.includes(form.state) ? "" : form.state,
    };
    setForm(next);
    clearErr("countryCode");
    const target = COUNTRY_CURRENCY[code];
    if (target && target !== currency && isCurrency(target)) {
      writeDraft({ form: next, ship, pay, couponApplied });
      setSwitchingCurrency(true);
      setCurrency(target); // reloads with prices in the new currency
    }
  };

  /* Enforce payment fallback when method becomes unavailable */
  useEffect(() => {
    if (pay === "card" && !cardAvailable) setPay(codAvailable ? "cod" : "card");
    if (pay === "cod" && !codAvailable) setPay(cardAvailable ? "card" : "cod");
    if (pay === "pay_on_site" && !payOnSiteAvailable) setPay(cardAvailable ? "card" : "cod");
  }, [cardAvailable, codAvailable, payOnSiteAvailable, pay]);

  const shipRule = resolveShipping(cc, currency);
  const freeShipTarget = shipRule.freeOver ?? Infinity;
  const stdShip = shipRule.fee;
  const expShip = Math.round(shipRule.fee * 2 * 100) / 100;

  const codFee = pay === "cod" ? (COD_FEE[currency] ?? 0) : 0;

  const lines = useMemo(
    () =>
      items.flatMap((it) => {
        const p = catalog[it.slug];
        if (!p) return [];
        const unit = tierUnitPrice(p.tiers, it.qty);
        return [{ ...it, p, unit }];
      }),
    [items, catalog],
  );

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
    const discount = couponApplied === PROMO_CODE ? subtotal * 0.1 : 0;
    const afterDisc = subtotal - discount;
    const freeShip = afterDisc >= freeShipTarget;
    const shipCost = ship === "express" ? expShip : freeShip ? 0 : stdShip;
    return {
      subtotal,
      discount,
      shipping: shipCost,
      cod: codFee,
      total: afterDisc + shipCost + codFee,
      freeShip,
    };
  }, [lines, ship, freeShipTarget, stdShip, expShip, couponApplied, codFee]);

  const applyCoupon = () => {
    const c = form.coupon.trim().toUpperCase();
    if (c === PROMO_CODE) {
      setCouponApplied(PROMO_CODE);
      update("coupon", PROMO_CODE);
    } else {
      setCouponApplied(null);
      setErrors((e) => ({
        ...e,
        coupon: t("commerce.checkout.validation.invalidCoupon", "Invalid coupon"),
      }));
    }
  };

  /* India pincode auto-fill */
  const lookupIndiaPincode = async (pincode: string) => {
    if (pincode.length !== 6 || cc !== "IN") return;
    setPincodeLooking(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = (await res.json()) as
        { Status?: string; PostOffice?: { District?: string; State?: string }[] }[] | null;
      const po = data?.[0]?.Status === "Success" ? data[0].PostOffice?.[0] : undefined;
      if (po) {
        if (po.District) {
          update("city", toTitleCase(po.District));
          clearErr("city");
        }
        if (po.State) {
          const list = COUNTRY_STATES["IN"] || [];
          const m = list.find((s) => s.toLowerCase() === String(po.State).toLowerCase());
          if (m) {
            update("state", m);
            clearErr("state");
          }
        }
      }
    } catch {
      /* silent */
    } finally {
      setPincodeLooking(false);
    }
  };

  function validate(): boolean {
    const required = t("commerce.checkout.validation.required", "Required");
    const e: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = t("commerce.checkout.validation.invalidEmail", "Enter a valid email");
    if (!form.firstName.trim()) e.firstName = required;
    if (!form.lastName.trim()) e.lastName = required;
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7)
      e.phone = t("commerce.checkout.validation.phoneTooShort", "Phone too short");
    else if (phoneDigits.length > 15)
      e.phone = t("commerce.checkout.validation.phoneTooLong", "Phone too long");
    if (!form.address1.trim()) e.address1 = required;
    if (!form.city.trim()) e.city = required;
    if (!form.countryCode) e.countryCode = required;
    if (stateRequired && !form.state.trim()) e.state = required;
    if (showZip) {
      if (!form.postal.trim()) e.postal = required;
      else {
        const patt = ZIP_PATTERNS[cc];
        if (patt && !patt.test(form.postal.trim()))
          e.postal = t("commerce.checkout.validation.invalidPostal", "Invalid postal code");
      }
    }
    if (pay === "card" && !isMoyasar) {
      if (form.cardNumber.replace(/\s/g, "").length < 13)
        e.cardNumber = t("commerce.checkout.validation.invalidCardNumber", "Invalid card number");
      if (!form.cardName.trim()) e.cardName = required;
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry))
        e.cardExpiry = t("commerce.checkout.validation.invalidExpiry", "MM/YY");
      if (form.cardCvc.length < 3)
        e.cardCvc = t("commerce.checkout.validation.invalidCvc", "Invalid");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* Build the canonical order payload (integer minor units) */
  function buildOrderPayload(): CheckoutOrder {
    return {
      customerName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      customerEmail: form.email.trim() || null,
      customerPhone: form.phone.trim() ? `${phoneCode}${normalizePhone(form.phone.trim())}` : null,
      countryCode: cc,
      currency,
      shippingTotalCents: Math.round(totals.shipping * 100),
      paymentMethod: pay,
      couponCode: couponApplied,
      codFeeCents: Math.round(codFee * 100),
      shippingAddress: {
        line1: form.address1.trim(),
        line2: form.address2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim() || undefined,
        zip: form.postal.trim() || undefined,
        country: ALL_COUNTRIES.find((c) => c.code === cc)?.name || cc,
      },
      items: lines.map((l) => ({
        productSlug: l.slug,
        name: l.p.name,
        quantity: l.qty,
        unitPriceCents: Math.round(l.unit * 100),
      })),
    };
  }

  async function submit(evt: SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!validate()) {
      requestAnimationFrame(() => {
        const first = document.querySelector<HTMLElement>("[data-error='true']");
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setSubmitting(true);
    setPayError(null);

    /* SAR card / mada → Moyasar hosted payment page */
    if (isMoyasar) {
      try {
        const res = await startSarPayment({
          order: buildOrderPayload(),
          origin: window.location.origin,
        });
        if (res.ok) {
          window.location.href = res.data.redirectUrl;
          return;
        }
        setPayError(res.error);
      } catch {
        setPayError(
          t("commerce.payment.startFailed", "We could not start the payment. Please try again."),
        );
      }
      setSubmitting(false);
      return;
    }

    /* COD and all non-Moyasar methods → record the order with the backend */
    const recordFailed = t(
      "commerce.payment.recordFailed",
      "We could not record your order. Please try again.",
    );
    try {
      const order = buildOrderPayload();
      // TODO(api): PlaceOrderInput has no slot yet for country code, shipping
      // method/total, coupon or COD fee; send them once the contract has them.
      const result = await placeOrder({
        items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        currency,
        customer: {
          name: order.customerName,
          email: order.customerEmail ?? "",
          phone: order.customerPhone ?? "",
        },
        shippingAddress: order.shippingAddress,
        paymentMethod: pay,
        notes: form.notes.trim() || undefined,
      });
      if (!result.ok || !result.data.orderNumber) {
        setPayError((!result.ok && result.error) || recordFailed);
        setSubmitting(false);
        return;
      }
      clearCart();
      const search = new URLSearchParams({
        method: pay,
        country: cc,
        currency,
        order: result.data.orderNumber,
      });
      window.location.assign(`${path("/order-confirmation")}?${search}`);
    } catch {
      setPayError(recordFailed);
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="container-editorial py-8 md:py-12">
        <LoadingBlock />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-editorial py-16">
        <div className="mx-auto max-w-xl border hairline bg-paper p-10 text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            {t("commerce.checkout.emptyBag", "Your bag is empty.")}
          </p>
          <a
            href={path("/shop")}
            className="inline-block bg-forest px-6 py-3 text-xs font-semibold tracking-[0.2em] text-ivory uppercase"
          >
            {t("commerce.checkout.continueShopping", "Continue shopping")}
          </a>
        </div>
      </div>
    );
  }

  const fullPhone = phoneCode ? `${phoneCode} ${normalizePhone(form.phone)}` : form.phone;
  const stepLabel = t("commerce.checkout.step.label", "Step");
  const submitLabel = submitting
    ? t("commerce.checkout.processing", "Processing…")
    : `${
        isMoyasar
          ? t("commerce.checkout.paySecurely", "Pay securely")
          : t("commerce.checkout.placeOrder", "Place order")
      } — ${formatMoney(totals.total, currency)}`;
  const submitDisabled = submitting || switchingCurrency;

  return (
    <div className="container-editorial py-8 md:py-12">
      <form
        onSubmit={submit}
        noValidate
        className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14"
      >
        {/* Form */}
        <div className="space-y-10 lg:col-span-7">
          <Section
            step="01"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.contact", "Contact")}
          >
            <Field label={t("commerce.fields.email", "Email address")} error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                data-ltr
                value={form.email}
                onChange={(e) => {
                  update("email", e.target.value);
                  clearErr("email");
                }}
                className={inputCls(errors.email)}
              />
            </Field>

            {signedInEmail ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border hairline bg-moss/5 px-3 py-3">
                <p className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
                  {t("commerce.checkout.signedInAs", "Signed in as")}{" "}
                  <span className="font-semibold text-foreground" data-ltr>
                    {signedInEmail}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                    setSignedInEmail(null);
                  }}
                  className="text-[11px] tracking-[0.15em] uppercase underline"
                >
                  {t("commerce.checkout.signOut", "Sign out")}
                </button>
              </div>
            ) : showOtp ? (
              <div className="border hairline p-4">
                <p className="mb-3 text-[11px] font-bold tracking-[0.18em] uppercase">
                  {t("commerce.checkout.signInWithCode", "Sign in with an email code")}
                </p>
                <EmailOtpSignIn
                  compact
                  defaultEmail={form.email}
                  onSignedIn={(mail) => {
                    update("email", mail);
                    clearErr("email");
                    setSignedInEmail(mail);
                    setShowOtp(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="mt-3 text-[11px] tracking-[0.15em] uppercase underline"
                >
                  {t("commerce.checkout.continueAsGuest", "Continue as guest")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowOtp(true)}
                className="text-[11px] font-semibold tracking-[0.15em] uppercase underline"
              >
                {t("commerce.checkout.haveAccount", "Have an account? Sign in with an email code")}
              </button>
            )}
          </Section>

          <Section
            step="02"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.shippingCountry", "Shipping country")}
          >
            <Field
              label={t("commerce.checkout.fields.country", "Country / Region")}
              error={errors.countryCode}
            >
              <select
                value={form.countryCode}
                onChange={(e) => changeCountry(e.target.value)}
                className={inputCls(errors.countryCode)}
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              {t("commerce.checkout.estDelivery", "Est. delivery")} · {shipRule.days} ·{" "}
              {t("commerce.checkout.pricedIn", "Priced in")} {curMeta.code}
            </p>
          </Section>

          <Section
            step="03"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.shippingAddress", "Shipping address")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("commerce.checkout.fields.firstName", "First name")}
                error={errors.firstName}
              >
                <input
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => {
                    update("firstName", e.target.value);
                    clearErr("firstName");
                  }}
                  className={inputCls(errors.firstName)}
                />
              </Field>
              <Field
                label={t("commerce.checkout.fields.lastName", "Last name")}
                error={errors.lastName}
              >
                <input
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => {
                    update("lastName", e.target.value);
                    clearErr("lastName");
                  }}
                  className={inputCls(errors.lastName)}
                />
              </Field>
            </div>

            <Field label={t("commerce.checkout.fields.address", "Address")} error={errors.address1}>
              <input
                autoComplete="address-line1"
                value={form.address1}
                onChange={(e) => {
                  update("address1", e.target.value);
                  clearErr("address1");
                }}
                className={inputCls(errors.address1)}
              />
            </Field>
            <Field label={t("commerce.checkout.fields.address2", "Apartment, suite (optional)")}>
              <input
                autoComplete="address-line2"
                value={form.address2}
                onChange={(e) => update("address2", e.target.value)}
                className={inputCls()}
              />
            </Field>

            <div className={`grid gap-4 ${showZip ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
              <Field label={t("commerce.checkout.fields.city", "City")} error={errors.city}>
                <input
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => {
                    update("city", e.target.value);
                    clearErr("city");
                  }}
                  className={inputCls(errors.city)}
                />
              </Field>
              <Field label={`${stateLabel}${stateRequired ? " *" : ""}`} error={errors.state}>
                {stateOptions.length > 0 ? (
                  <select
                    value={form.state}
                    onChange={(e) => {
                      update("state", e.target.value);
                      clearErr("state");
                    }}
                    className={inputCls(errors.state)}
                  >
                    <option value="">
                      {t("commerce.checkout.fields.selectPlaceholder", "Select…")}
                    </option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(e) => {
                      update("state", e.target.value);
                      clearErr("state");
                    }}
                    className={inputCls(errors.state)}
                  />
                )}
              </Field>
              {showZip && (
                <Field
                  label={
                    cc === "IN"
                      ? t("commerce.checkout.fields.pinCode", "PIN code")
                      : t("commerce.checkout.fields.postalCode", "Postal code")
                  }
                  error={errors.postal}
                >
                  <div className="relative">
                    <input
                      autoComplete="postal-code"
                      value={form.postal}
                      onChange={(e) => {
                        const v = e.target.value;
                        update("postal", v);
                        clearErr("postal");
                        if (cc === "IN" && /^\d{6}$/.test(v)) void lookupIndiaPincode(v);
                      }}
                      className={inputCls(errors.postal)}
                    />
                    {pincodeLooking && (
                      <span className="absolute end-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground">
                        …
                      </span>
                    )}
                  </div>
                </Field>
              )}
            </div>

            <Field
              label={`${t("commerce.checkout.fields.phone", "Phone")}${phoneCode ? ` (${phoneCode})` : ""}`}
              error={errors.phone}
            >
              <div className="flex">
                {phoneCode && (
                  <span
                    className="flex h-11 items-center border border-e-0 hairline bg-ivory px-3 font-mono text-sm text-forest/70 tabular-nums"
                    data-ltr
                  >
                    {phoneCode}
                  </span>
                )}
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => {
                    update("phone", normalizePhone(e.target.value));
                    clearErr("phone");
                  }}
                  className={`${inputCls(errors.phone)} flex-1`}
                />
              </div>
              {form.phone && !errors.phone && (
                <span className="mt-1 block font-mono text-[10px] text-muted-foreground" data-ltr>
                  {fullPhone}
                </span>
              )}
            </Field>
          </Section>

          <Section
            step="04"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.deliveryMethod", "Delivery method")}
          >
            <div className="grid gap-3">
              <ShipOption
                active={ship === "standard"}
                onClick={() => setShip("standard")}
                title={t("commerce.checkout.delivery.standard", "Standard shipping")}
                meta={`${shipRule.days} · ${t("commerce.delivery.tracked", "Tracked")}`}
                price={
                  totals.freeShip
                    ? t("commerce.summary.free", "Free")
                    : formatMoney(stdShip, currency)
                }
              />
              <ShipOption
                active={ship === "express"}
                onClick={() => setShip("express")}
                title={t("commerce.delivery.express", "Express shipping")}
                meta={t(
                  "commerce.delivery.priorityCourier",
                  "Priority courier · 3–5 business days",
                )}
                price={formatMoney(expShip, currency)}
              />
            </div>
          </Section>

          <Section
            step="05"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.payment", "Payment")}
          >
            <div className="mb-4 grid grid-cols-3 gap-3">
              <PayTab
                active={pay === "card"}
                onClick={() => setPay("card")}
                disabled={!cardAvailable}
              >
                {currency === "SAR"
                  ? t("commerce.payment.madaOrCard", "Mada / Card")
                  : t("commerce.payment.cardOrDebit", "Credit / Debit")}
              </PayTab>
              <PayTab active={pay === "cod"} onClick={() => setPay("cod")} disabled={!codAvailable}>
                {t("commerce.payment.cod", "Cash on Delivery")}
              </PayTab>
              <PayTab
                active={pay === "pay_on_site"}
                onClick={() => setPay("pay_on_site")}
                disabled={!payOnSiteAvailable}
              >
                {t("commerce.payment.payAtStore", "Pay at Store")}
              </PayTab>
            </div>

            {isMoyasar && (
              <div className="border-2 border-forest bg-ivory p-5">
                <div className="mb-2 font-mono text-[10px] tracking-[0.28em] text-forest/60 uppercase">
                  {t("commerce.payment.moyasarTitle", "Secure hosted payment · Moyasar")}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "commerce.payment.moyasarBody",
                    "Mada and Visa / Mastercard payments in SAR are processed on Moyasar's secure payment page. You will be redirected to complete the payment and returned here once it is confirmed. Card details are never entered or stored on this site.",
                  )}
                </p>
              </div>
            )}

            {payError && (
              <div
                ref={payErrorRef}
                role="alert"
                className="mt-4 border-s-4 border-destructive bg-destructive/10 p-4 text-sm font-semibold text-destructive"
              >
                {payError}
              </div>
            )}

            {pay === "card" && !isMoyasar && (
              <div className="space-y-4">
                <Field
                  label={t("commerce.checkout.fields.cardNumber", "Card number")}
                  error={errors.cardNumber}
                >
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) =>
                      update(
                        "cardNumber",
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 19)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    className={inputCls(errors.cardNumber)}
                  />
                </Field>
                <Field
                  label={t("commerce.checkout.fields.cardName", "Name on card")}
                  error={errors.cardName}
                >
                  <input
                    autoComplete="cc-name"
                    value={form.cardName}
                    onChange={(e) => update("cardName", e.target.value)}
                    className={inputCls(errors.cardName)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label={t("commerce.checkout.fields.cardExpiry", "Expiry (MM/YY)")}
                    error={errors.cardExpiry}
                  >
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="12/28"
                      value={form.cardExpiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        update("cardExpiry", v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                      }}
                      className={inputCls(errors.cardExpiry)}
                    />
                  </Field>
                  <Field
                    label={t("commerce.checkout.fields.cardCvc", "CVC")}
                    error={errors.cardCvc}
                  >
                    <input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={form.cardCvc}
                      onChange={(e) =>
                        update("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className={inputCls(errors.cardCvc)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {pay === "cod" && (
              <div className="border hairline bg-ivory p-5 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "commerce.checkout.codNotice",
                  "Pay in cash to the courier upon delivery. Our team will confirm your order by phone before dispatch.",
                )}
                {codFee > 0 && (
                  <div className="mt-2 font-mono text-[11px] tracking-[0.18em] text-forest uppercase">
                    {t("commerce.checkout.codHandlingFee", "+ {amount} handling fee").replace(
                      "{amount}",
                      formatMoney(codFee, currency),
                    )}
                  </div>
                )}
              </div>
            )}

            {pay === "pay_on_site" && (
              <div className="border hairline bg-ivory p-5 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "commerce.checkout.payOnSiteNotice",
                  "Reserve online, pay in-store. Pickup at Ghori Trading LLC · 2003, One By Omniyat, Business Bay, Dubai, UAE. Call +971 800 44674 for assistance.",
                )}
              </div>
            )}
          </Section>

          <Section
            step="06"
            stepLabel={stepLabel}
            title={t("commerce.checkout.step.notes", "Order notes (optional)")}
          >
            <Field label={t("commerce.checkout.fields.notes", "Anything we should know?")}>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputCls()} resize-none py-2`}
              />
            </Field>
          </Section>

          <div className="hidden lg:block">
            <SubmitButton disabled={submitDisabled} label={submitLabel} />
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {t("commerce.checkout.agreeTerms", "By placing your order you agree to our")}{" "}
              <a href={path("/terms")} className="underline">
                {t("commerce.checkout.terms", "Terms")}
              </a>{" "}
              {t("commerce.checkout.and", "and")}{" "}
              <a href={path("/privacy")} className="underline">
                {t("commerce.checkout.privacyPolicy", "Privacy Policy")}
              </a>
              .
            </p>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-ivory p-6 md:p-8 lg:sticky lg:top-24">
            <div className="mb-6 flex items-center justify-between">
              <div className="eyebrow">{t("commerce.summary.title", "Order Summary")}</div>
              <span className="font-mono text-[10px] tracking-[0.22em] text-forest/60 uppercase">
                {curMeta.code}
              </span>
            </div>

            <ul className="mb-6 space-y-4">
              {lines.map(({ slug, qty, p, unit }) => (
                <li key={slug} className="flex gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={p.image.src}
                      srcSet={p.image.srcSet}
                      sizes="64px"
                      alt={p.imageAlt}
                      title={imageTitles[slug]}
                      className="h-16 w-16 bg-paper object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center bg-forest font-mono text-[10px] text-ivory">
                      {qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.size}</div>
                    <div className="font-mono text-[11px] text-forest/60">
                      {formatMoney(unit, currency)} × {qty}
                    </div>
                  </div>
                  <div className="font-mono text-sm font-semibold tabular-nums">
                    {formatMoney(unit * qty, currency)}
                  </div>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="mb-5 border-t hairline pt-4">
              {couponApplied ? (
                <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span className="text-forest">
                    {t("commerce.checkout.couponAppliedOff", "Coupon {code} — 10% off").replace(
                      "{code}",
                      couponApplied,
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponApplied(null);
                      update("coupon", "");
                    }}
                    className="text-muted-foreground underline"
                  >
                    {t("commerce.checkout.remove", "Remove")}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    placeholder={t("commerce.cart.promoCode", "Promo code")}
                    aria-label={t("commerce.cart.promoCode", "Promo code")}
                    value={form.coupon}
                    onChange={(e) => {
                      update("coupon", e.target.value);
                      clearErr("coupon");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCoupon();
                      }
                    }}
                    className={`${inputCls(errors.coupon)} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="border hairline px-4 text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-forest hover:text-ivory"
                  >
                    {t("commerce.cart.apply", "Apply")}
                  </button>
                </div>
              )}
              {errors.coupon && (
                <div className="mt-1 text-[11px] text-red-600">{errors.coupon}</div>
              )}
            </div>

            <div className="space-y-2 border-t hairline pt-4 font-mono text-sm tabular-nums">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("commerce.summary.subtotal", "Subtotal")}
                </span>
                <span>{formatMoney(totals.subtotal, currency)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>{t("commerce.summary.discount", "Discount")}</span>
                  <span>− {formatMoney(totals.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("commerce.checkout.shippingWithMethod", "Shipping ({method})").replace(
                    "{method}",
                    ship,
                  )}
                </span>
                <span>
                  {totals.shipping === 0
                    ? t("commerce.summary.free", "Free")
                    : formatMoney(totals.shipping, currency)}
                </span>
              </div>
              {totals.cod > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("commerce.checkout.codHandling", "COD handling")}
                  </span>
                  <span>{formatMoney(totals.cod, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("commerce.summary.taxes", "Taxes")}
                </span>
                <span>{t("commerce.summary.incl", "Incl.")}</span>
              </div>
              <div className="flex justify-between border-t hairline pt-3 text-base font-bold">
                <span>{t("commerce.summary.total", "Total")}</span>
                <span>{formatMoney(totals.total, currency)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-1.5 border-t hairline pt-6 text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              <div>— {t("commerce.checkout.encryptedCheckout", "Encrypted checkout")}</div>
              <div>— {t("commerce.checkout.authenticityVerified", "Authenticity verified")}</div>
              <div>— {t("commerce.checkout.exchangeWindow", "7-day exchange window")}</div>
            </div>

            {quote && <div className="mt-6">{quote}</div>}

            <div className="mt-6 lg:hidden">
              <SubmitButton disabled={submitDisabled} label={submitLabel} />
            </div>

            <a
              href={path("/cart")}
              className="mt-4 block text-center text-[11px] tracking-[0.18em] text-muted-foreground uppercase underline underline-offset-4 hover:text-forest"
            >
              {t("commerce.checkout.returnToCart", "← Return to cart")}
            </a>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutForm({ i18n, ...props }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Checkout {...props} />
    </I18nProvider>
  );
}
