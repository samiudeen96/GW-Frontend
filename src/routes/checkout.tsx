import { abs, absAr, localeOf, canonicalFor } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useCart } from "@/lib/cart";
import { getProduct, productImageAlt, productImageTitle } from "@/lib/products";
import { useRegion, formatMoney, lineTotal, unitPriceForQty, getCurrency } from "@/lib/pricing";
import { useEffect, useMemo, useState } from "react";
import { CustomerQuote } from "@/components/site/SocialProof";
import { resolveShipping } from "@/lib/shipping";
import { useServerFn } from "@tanstack/react-start";
import { startSarPayment } from "@/lib/payments.functions";
import { placeOrder } from "@/lib/orders.functions";
import { EmailOtpSignIn } from "@/components/site/EmailOtpSignIn";
import { useSession } from "@/lib/use-session";
import { getMyAccount, type AccountAddress } from "@/lib/account.functions";
import { useT } from "@/lib/i18n";




import {
  ALL_COUNTRIES,
  COUNTRY_PHONE_CODES,
  COUNTRY_STATES,
  NO_ZIP_COUNTRIES,
  STATE_LABELS,
  STATE_REQUIRED_COUNTRIES,
  ZIP_PATTERNS,
} from "@/lib/countryStateData";

export const Route = createFileRoute("/checkout")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const isAr = locale === "ar";
    return {
      meta: [
        { title: isAr ? "الدفع — Green Wealth" : "Checkout — Green Wealth" },
        {
          name: "description",
          content: isAr
            ? "أكمل طلبك من غسول Neo Hair Lotion بأمان. شحن عالمي وأصالة موثّقة."
            : "Complete your Neo Hair Lotion order securely. Global shipping, verified authenticity.",
        },
        { name: "robots", content: "noindex, follow" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/checkout", locale) }],
    };
  },
  component: CheckoutPage,
});

/* Shipping fees/thresholds come from src/lib/shipping.ts (country-wise rates). */

/* Cash-on-delivery handling fee (India only, matches GW: ₹100) */
const COD_FEE: Record<string, number> = { INR: 100 };

/* Country → currency hint (best-effort autoselect) */
const COUNTRY_CURRENCY: Record<string, string> = {
  AE: "AED", SA: "SAR", KW: "KWD", QA: "QAR", BH: "BHD", OM: "OMR",
  IN: "INR", PK: "PKR", AF: "AFN",
  US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", SG: "SGD",
};

/* GCC + COD availability (ported from GW Checkout.tsx lines 160-174) */
const GCC = new Set(["AE", "SA", "KW", "QA", "BH", "OM"]);
const COD_COUNTRIES = new Set([...GCC, "IN", "PK", "AF"]);


type ShipMethod = "standard" | "express";
type PayMethod = "card" | "cod" | "pay_on_site";

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

const INITIAL: Form = {
  email: "", firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", state: "", postal: "",
  countryCode: "AE", notes: "", coupon: "",
  cardNumber: "", cardName: "", cardExpiry: "", cardCvc: "",
};

const toTitleCase = (str: string) =>
  str.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
const normalizePhone = (val: string) => val.replace(/^0+/, "");

function CheckoutPage() {
  const t = useT();
  const { items, clear } = useCart();
  const { currency, setCurrency } = useRegion();
  const curMeta = getCurrency(currency);
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>(INITIAL);
  const [ship, setShip] = useState<ShipMethod>("standard");
  const [pay, setPay] = useState<PayMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [pincodeLooking, setPincodeLooking] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const { user, loading: sessionLoading, signOut } = useSession();
  const startPayment = useServerFn(startSarPayment);
  const submitOrder = useServerFn(placeOrder);

  /* Prefill the contact email once a signed-in customer is detected */
  useEffect(() => {
    if (user?.email) setForm((f) => (f.email ? f : { ...f, email: user.email as string }));
  }, [user?.email]);

  /* Saved address book (signed-in customers only) */
  const [savedAddresses, setSavedAddresses] = useState<AccountAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const loadAccount = useServerFn(getMyAccount);
  useEffect(() => {
    if (!user) { setSavedAddresses([]); setSelectedAddressId(null); return; }
    let active = true;
    loadAccount({})
      .then((res) => { if (active) setSavedAddresses(res.addresses ?? []); })
      .catch(() => { if (active) setSavedAddresses([]); });
    return () => { active = false; };
  }, [user?.id]);

  const applySavedAddress = (a: AccountAddress) => {
    setSelectedAddressId(a.id);
    const code =
      ALL_COUNTRIES.find(
        (c) =>
          c.code === (a.country ?? "").toUpperCase() ||
          c.name.toLowerCase() === (a.country ?? "").toLowerCase(),
      )?.code;
    const parts = (a.name ?? "").trim().split(/\s+/);
    const dial = code ? COUNTRY_PHONE_CODES[code] || "" : "";
    const phone = (a.phone ?? "").replace(/\s+/g, "");
    setForm((f) => ({
      ...f,
      firstName: parts[0] ?? f.firstName,
      lastName: parts.slice(1).join(" ") || f.lastName,
      address1: a.line1 ?? "",
      address2: a.line2 ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      postal: a.zip ?? "",
      countryCode: code ?? f.countryCode,
      phone: normalizePhone(dial && phone.startsWith(dial) ? phone.slice(dial.length) : phone),
    }));
    setErrors({});
  };



  /* SAR card / mada is processed by Moyasar's hosted page (no card data on-site) */
  const isMoyasar = currency === "SAR" && pay === "card";


  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const clearErr = (k: keyof Form) =>
    setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });

  /* Derived country context */
  const cc = form.countryCode;
  const phoneCode = COUNTRY_PHONE_CODES[cc] || "";
  const showZip = !NO_ZIP_COUNTRIES.has(cc);
  const stateOptions = COUNTRY_STATES[cc] || [];
  const stateRequired = STATE_REQUIRED_COUNTRIES.has(cc);
  const stateLabel = STATE_LABELS[cc] || "State / Region";

  /* Payment availability per country (ported logic) */
  const codAvailable = COD_COUNTRIES.has(cc);
  const payOnSiteAvailable = cc === "AE";
  const cardAvailable = cc !== "IN"; // GW routes IN to Razorpay

  /* Auto-switch currency when country implies a supported one */
  useEffect(() => {
    const target = COUNTRY_CURRENCY[cc];
    if (target && target !== currency) setCurrency(target);
    // reset state if not in new list
    if (stateOptions.length > 0 && !stateOptions.includes(form.state)) {
      setForm((f) => ({ ...f, state: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cc]);

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

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + lineTotal(it.slug, it.qty, currency), 0);
    const discount = couponApplied === "GW10" ? subtotal * 0.1 : 0;
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
  }, [items, currency, ship, freeShipTarget, stdShip, expShip, couponApplied, codFee]);

  const applyCoupon = () => {
    const c = form.coupon.trim().toUpperCase();
    if (c === "GW10") { setCouponApplied("GW10"); update("coupon", "GW10"); }
    else { setCouponApplied(null); setErrors((e) => ({ ...e, coupon: t("commerce.checkout.validation.invalidCoupon", "Invalid coupon") })); }
  };

  /* India pincode auto-fill (ported from GW lines 310-327) */
  const lookupIndiaPincode = async (pincode: string) => {
    if (pincode.length !== 6 || cc !== "IN") return;
    setPincodeLooking(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        if (po.District) { update("city", toTitleCase(po.District)); clearErr("city"); }
        if (po.State) {
          const list = COUNTRY_STATES["IN"] || [];
          const m = list.find((s) => s.toLowerCase() === String(po.State).toLowerCase());
          if (m) { update("state", m); clearErr("state"); }
        }
      }
    } catch { /* silent */ }
    finally { setPincodeLooking(false); }
  };

  function validate(): boolean {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("commerce.checkout.validation.invalidEmail", "Enter a valid email");
    if (!form.firstName.trim()) e.firstName = t("commerce.checkout.validation.required", "Required");
    if (!form.lastName.trim()) e.lastName = t("commerce.checkout.validation.required", "Required");
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) e.phone = t("commerce.checkout.validation.phoneTooShort", "Phone too short");
    else if (phoneDigits.length > 15) e.phone = t("commerce.checkout.validation.phoneTooLong", "Phone too long");
    if (!form.address1.trim()) e.address1 = t("commerce.checkout.validation.required", "Required");
    if (!form.city.trim()) e.city = t("commerce.checkout.validation.required", "Required");
    if (!form.countryCode) e.countryCode = t("commerce.checkout.validation.required", "Required");
    if (stateRequired && !form.state.trim()) e.state = t("commerce.checkout.validation.required", "Required");
    if (showZip) {
      if (!form.postal.trim()) e.postal = t("commerce.checkout.validation.required", "Required");
      else {
        const patt = ZIP_PATTERNS[cc];
        if (patt && !patt.test(form.postal.trim())) e.postal = t("commerce.checkout.validation.invalidPostal", "Invalid postal code");
      }
    }
    if (pay === "card" && !isMoyasar) {
      if (form.cardNumber.replace(/\s/g, "").length < 13) e.cardNumber = t("commerce.checkout.validation.invalidCardNumber", "Invalid card number");
      if (!form.cardName.trim()) e.cardName = t("commerce.checkout.validation.required", "Required");
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = t("commerce.checkout.validation.invalidExpiry", "MM/YY");
      if (form.cardCvc.length < 3) e.cardCvc = t("commerce.checkout.validation.invalidCvc", "Invalid");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* Build the canonical order payload (integer minor units) */
  function buildOrderPayload() {
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
      items: items.map((it) => {
        const p = getProduct(it.slug);
        return {
          productSlug: it.slug,
          name: p?.name || it.slug,
          quantity: it.qty,
          unitPriceCents: Math.round(unitPriceForQty(it.slug, it.qty, currency) * 100),
        };
      }),
    };
  }

  async function submit(evt: React.FormEvent) {
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
        const res = await startPayment({
          data: { order: buildOrderPayload(), origin: window.location.origin },
        });
        if (res.ok) {
          window.location.href = res.redirectUrl;
          return;
        }
        setPayError(res.error);
      } catch {
        setPayError(t("commerce.payment.startFailed", "We could not start the payment. Please try again."));
      }
      setSubmitting(false);
      return;
    }

    /* COD and all non-Moyasar methods → record the order server-side */
    try {
      const result = await submitOrder({ data: buildOrderPayload() });
      if (!result.orderNumber) {
        setPayError(result.routingReason || t("commerce.payment.recordFailed", "We could not record your order. Please try again."));
        setSubmitting(false);
        return;
      }
      clear();
      navigate({
        to: "/order-confirmation",
        search: { method: pay, country: cc, currency, order: result.orderNumber } as never,
      });
    } catch {
      setPayError(t("commerce.payment.recordFailed", "We could not record your order. Please try again."));
      setSubmitting(false);
    }
  }



  if (items.length === 0) {
    return (
      <>
        <PageHeader eyebrow={t("commerce.checkout.eyebrow", "Secure Checkout")} title={t("commerce.checkout.title", "Complete your order")} />
        <div className="container-editorial py-16">
          <div className="border hairline p-10 text-center max-w-xl mx-auto bg-paper">
            <p className="text-sm text-muted-foreground mb-6">{t("commerce.checkout.emptyBag", "Your bag is empty.")}</p>
            <Link
              to="/shop"
              className="inline-block bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              {t("commerce.checkout.continueShopping", "Continue shopping")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const fullPhone = phoneCode ? `${phoneCode} ${normalizePhone(form.phone)}` : form.phone;

  return (
    <>
      <PageHeader eyebrow={t("commerce.checkout.eyebrow", "Secure Checkout")} title={t("commerce.checkout.title", "Complete your order")} />
      <div className="container-editorial py-8 md:py-12">
        <form onSubmit={submit} className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left — form */}
          <div className="lg:col-span-7 space-y-10">
            <Section step="01" title={t("commerce.checkout.step.contact", "Contact")}>
              <Field label={t("commerce.fields.email", "Email address")} error={errors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  data-ltr
                  value={form.email}
                  onChange={(e) => { update("email", e.target.value); clearErr("email"); }}
                  className={input(errors.email)}
                />
              </Field>

              {sessionLoading ? null : user ? (
                <div className="border hairline bg-moss/5 px-3 py-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {t("commerce.checkout.signedInAs", "Signed in as")} <span className="font-semibold text-foreground" data-ltr>{user.email}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="text-[11px] uppercase tracking-[0.15em] underline"
                  >
                    {t("commerce.checkout.signOut", "Sign out")}
                  </button>
                </div>
              ) : showOtp ? (
                <div className="border hairline p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] font-bold mb-3">{t("commerce.checkout.signInWithCode", "Sign in with an email code")}</p>
                  <EmailOtpSignIn
                    compact
                    defaultEmail={form.email}
                    onSignedIn={(mail) => { update("email", mail); clearErr("email"); setShowOtp(false); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="mt-3 text-[11px] uppercase tracking-[0.15em] underline"
                  >
                    {t("commerce.checkout.continueAsGuest", "Continue as guest")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowOtp(true)}
                  className="text-[11px] uppercase tracking-[0.15em] font-semibold underline"
                >
                  {t("commerce.checkout.haveAccount", "Have an account? Sign in with an email code")}
                </button>
              )}
            </Section>


            <Section step="02" title={t("commerce.checkout.step.shippingCountry", "Shipping country")}>
              <Field label={t("commerce.checkout.fields.country", "Country / Region")} error={errors.countryCode}>
                <select
                  value={form.countryCode}
                  onChange={(e) => { update("countryCode", e.target.value); clearErr("countryCode"); }}
                  className={input(errors.countryCode)}
                >
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-[0.15em]">
                {t("commerce.checkout.estDelivery", "Est. delivery")} · {shipRule.days} · {t("commerce.checkout.pricedIn", "Priced in")} {curMeta.code}
              </p>
            </Section>

            <Section step="03" title={t("commerce.checkout.step.shippingAddress", "Shipping address")}>
              {user && savedAddresses.length > 0 && (
                <div className="border hairline p-4 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {t("commerce.checkout.savedAddresses", "Saved addresses · select to autofill")}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {savedAddresses.map((a) => {
                      const active = selectedAddressId === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => applySavedAddress(a)}
                          className={`text-left border hairline p-3 text-[12px] leading-relaxed transition-colors ${
                            active ? "bg-forest text-paper" : "bg-paper hover:bg-ivory"
                          }`}
                        >
                          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] opacity-70">
                            {active ? t("commerce.checkout.selected", "Selected") : t("commerce.checkout.usedTimes", "Used {n}×").replace("{n}", String(a.usedCount))}
                          </span>
                          {a.name && <span className="block font-semibold mt-1">{a.name}</span>}
                          <span className="block">{a.line1}</span>
                          {a.line2 && <span className="block">{a.line2}</span>}
                          <span className="block">
                            {[a.city, a.state, a.zip].filter(Boolean).join(", ")}
                          </span>
                          <span className="block">{a.country}</span>
                          {a.phone && <span className="block font-mono">{a.phone}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {selectedAddressId && (
                    <button
                      type="button"
                      onClick={() => { setSelectedAddressId(null); }}
                      className="text-[10px] font-mono uppercase tracking-[0.2em] underline"
                    >
                      {t("commerce.checkout.enterNewAddress", "Enter a new address")}
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label={t("commerce.checkout.fields.firstName", "First name")} error={errors.firstName}>
                  <input autoComplete="given-name" value={form.firstName}
                    onChange={(e) => { update("firstName", e.target.value); clearErr("firstName"); }}
                    className={input(errors.firstName)} />
                </Field>
                <Field label={t("commerce.checkout.fields.lastName", "Last name")} error={errors.lastName}>
                  <input autoComplete="family-name" value={form.lastName}
                    onChange={(e) => { update("lastName", e.target.value); clearErr("lastName"); }}
                    className={input(errors.lastName)} />
                </Field>
              </div>

              <Field label={t("commerce.checkout.fields.address", "Address")} error={errors.address1}>
                <input autoComplete="address-line1" value={form.address1}
                  onChange={(e) => { update("address1", e.target.value); clearErr("address1"); }}
                  className={input(errors.address1)} />
              </Field>
              <Field label={t("commerce.checkout.fields.address2", "Apartment, suite (optional)")}>
                <input autoComplete="address-line2" value={form.address2}
                  onChange={(e) => update("address2", e.target.value)}
                  className={input()} />
              </Field>

              <div className={`grid gap-4 ${showZip ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
                <Field label={t("commerce.checkout.fields.city", "City")} error={errors.city}>
                  <input autoComplete="address-level2" value={form.city}
                    onChange={(e) => { update("city", e.target.value); clearErr("city"); }}
                    className={input(errors.city)} />
                </Field>
                <Field label={`${stateLabel}${stateRequired ? " *" : ""}`} error={errors.state}>
                  {stateOptions.length > 0 ? (
                    <select
                      value={form.state}
                      onChange={(e) => { update("state", e.target.value); clearErr("state"); }}
                      className={input(errors.state)}
                    >
                      <option value="">{t("commerce.checkout.fields.selectPlaceholder", "Select…")}</option>
                      {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input autoComplete="address-level1" value={form.state}
                      onChange={(e) => { update("state", e.target.value); clearErr("state"); }}
                      className={input(errors.state)} />
                  )}
                </Field>
                {showZip && (
                  <Field label={cc === "IN" ? t("commerce.checkout.fields.pinCode", "PIN code") : t("commerce.checkout.fields.postalCode", "Postal code")} error={errors.postal}>
                    <div className="relative">
                      <input
                        autoComplete="postal-code"
                        value={form.postal}
                        onChange={(e) => {
                          const v = e.target.value;
                          update("postal", v); clearErr("postal");
                          if (cc === "IN" && /^\d{6}$/.test(v)) lookupIndiaPincode(v);
                        }}
                        className={input(errors.postal)}
                      />
                      {pincodeLooking && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                          …
                        </span>
                      )}
                    </div>
                  </Field>
                )}
              </div>

              <Field label={`Phone${phoneCode ? ` (${phoneCode})` : ""}`} error={errors.phone}>
                <div className="flex">
                  {phoneCode && (
                    <span className="border hairline border-r-0 h-11 flex items-center px-3 bg-ivory text-sm font-mono tabular-nums text-forest/70">
                      {phoneCode}
                    </span>
                  )}
                  <input type="tel" autoComplete="tel" value={form.phone}
                    onChange={(e) => { update("phone", normalizePhone(e.target.value)); clearErr("phone"); }}
                    className={`${input(errors.phone)} flex-1`} />
                </div>
                {form.phone && !errors.phone && (
                  <span className="block mt-1 text-[10px] font-mono text-muted-foreground">
                    {fullPhone}
                  </span>
                )}
              </Field>
            </Section>

            <Section step="04" title={t("commerce.checkout.step.deliveryMethod", "Delivery method")}>
              <div className="grid gap-3">
                <ShipOption
                  active={ship === "standard"}
                  onClick={() => setShip("standard")}
                  title={t("commerce.checkout.delivery.standard", "Standard shipping")}
                  meta={`${shipRule.days} · ${t("commerce.delivery.tracked", "Tracked")}`}
                  price={totals.freeShip ? t("commerce.summary.free", "Free") : formatMoney(stdShip, currency)}
                />
                <ShipOption
                  active={ship === "express"}
                  onClick={() => setShip("express")}
                  title={t("commerce.delivery.express", "Express shipping")}
                  meta={t("commerce.delivery.priorityCourier", "Priority courier · 3–5 business days")}
                  price={formatMoney(expShip, currency)}
                />
              </div>
            </Section>

            <Section step="05" title={t("commerce.checkout.step.payment", "Payment")}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <PayTab active={pay === "card"} onClick={() => setPay("card")} disabled={!cardAvailable}>
                  {currency === "SAR" ? t("commerce.payment.madaOrCard", "Mada / Card") : t("commerce.payment.cardOrDebit", "Credit / Debit")}
                </PayTab>
                <PayTab active={pay === "cod"} onClick={() => setPay("cod")} disabled={!codAvailable}>
                  {t("commerce.payment.cod", "Cash on Delivery")}
                </PayTab>
                <PayTab active={pay === "pay_on_site"} onClick={() => setPay("pay_on_site")} disabled={!payOnSiteAvailable}>
                  {t("commerce.payment.payAtStore", "Pay at Store")}
                </PayTab>
              </div>

              {isMoyasar && (
                <div className="border-2 border-forest bg-ivory p-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-forest/60 mb-2">
                    {t("commerce.payment.moyasarTitle", "Secure hosted payment · Moyasar")}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      "commerce.payment.moyasarBody",
                      "Mada and Visa / Mastercard payments in SAR are processed on Moyasar's secure payment page. You will be redirected to complete the payment and returned here once it is confirmed. Card details are never entered or stored on this site.",
                    )}
                  </p>
                </div>
              )}

              {payError && (
                <div className="mt-4 border-l-4 border-destructive bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                  {payError}
                </div>
              )}

              {pay === "card" && !isMoyasar && (
                <div className="space-y-4">

                  <Field label={t("commerce.checkout.fields.cardNumber", "Card number")} error={errors.cardNumber}>
                    <input
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={(e) => update("cardNumber",
                        e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(),
                      )}
                      className={input(errors.cardNumber)}
                    />
                  </Field>
                  <Field label={t("commerce.checkout.fields.cardName", "Name on card")} error={errors.cardName}>
                    <input value={form.cardName}
                      onChange={(e) => update("cardName", e.target.value)}
                      className={input(errors.cardName)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t("commerce.checkout.fields.cardExpiry", "Expiry (MM/YY)")} error={errors.cardExpiry}>
                      <input placeholder="12/28" value={form.cardExpiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          update("cardExpiry", v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                        }}
                        className={input(errors.cardExpiry)} />
                    </Field>
                    <Field label={t("commerce.checkout.fields.cardCvc", "CVC")} error={errors.cardCvc}>
                      <input inputMode="numeric" placeholder="123" value={form.cardCvc}
                        onChange={(e) => update("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={input(errors.cardCvc)} />
                    </Field>
                  </div>
                </div>
              )}

              {pay === "cod" && (
                <div className="border hairline p-5 bg-ivory text-sm text-muted-foreground leading-relaxed">
                  {t("commerce.checkout.codNotice", "Pay in cash to the courier upon delivery. Our team will confirm your order by phone before dispatch.")}
                  {codFee > 0 && (
                    <div className="mt-2 text-forest font-mono text-[11px] uppercase tracking-[0.18em]">
                      {t("commerce.checkout.codHandlingFee", "+ {amount} handling fee").replace("{amount}", formatMoney(codFee, currency))}
                    </div>
                  )}
                </div>
              )}

              {pay === "pay_on_site" && (
                <div className="border hairline p-5 bg-ivory text-sm text-muted-foreground leading-relaxed">
                  {t("commerce.checkout.payOnSiteNotice", "Reserve online, pay in-store. Pickup at Ghori Trading LLC · 2003, One By Omniyat, Business Bay, Dubai, UAE. Call +971 800 44674 for assistance.")}
                </div>
              )}
            </Section>

            <Section step="06" title={t("commerce.checkout.step.notes", "Order notes (optional)")}>
              <Field label={t("commerce.checkout.fields.notes", "Anything we should know?")}>
                <textarea rows={3} value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className={`${input()} py-2 resize-none`} />
              </Field>
            </Section>

            <div className="hidden lg:block">
              <SubmitButton submitting={submitting} label={`${isMoyasar ? t("commerce.checkout.paySecurely", "Pay securely") : t("commerce.checkout.placeOrder", "Place order")} — ${formatMoney(totals.total, currency)}`} />
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                {t("commerce.checkout.agreeTerms", "By placing your order you agree to our")}{" "}
                <Link to="/terms" className="underline">{t("commerce.checkout.terms", "Terms")}</Link> {t("commerce.checkout.and", "and")}{" "}
                <Link to="/privacy" className="underline">{t("commerce.checkout.privacyPolicy", "Privacy Policy")}</Link>.
              </p>
            </div>
          </div>

          {/* Right — summary */}
          <aside className="lg:col-span-5">
            <div className="bg-ivory p-6 md:p-8 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="eyebrow">{t("commerce.summary.title", "Order Summary")}</div>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-forest/60">
                  {curMeta.code}
                </span>
              </div>

              <ul className="space-y-4 mb-6">
                {items.map((it) => {
                  const p = getProduct(it.slug);
                  if (!p) return null;
                  const unit = unitPriceForQty(it.slug, it.qty, currency);
                  return (
                    <li key={it.slug} className="flex gap-4">
                      <div className="relative shrink-0">
                        <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} className="w-16 h-16 object-cover bg-paper"
          loading="lazy"
          decoding="async"
        />
                        <span className="absolute -top-2 -right-2 bg-forest text-ivory text-[10px] w-5 h-5 flex items-center justify-center font-mono">
                          {it.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.size}</div>
                        <div className="text-[11px] font-mono text-forest/60">
                          {formatMoney(unit, currency)} × {it.qty}
                        </div>
                      </div>
                      <div className="text-sm font-mono tabular-nums font-semibold">
                        {formatMoney(unit * it.qty, currency)}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Coupon */}
              <div className="mb-5 border-t hairline pt-4">
                {couponApplied ? (
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em]">
                    <span className="text-forest">{t("commerce.checkout.couponAppliedOff", "Coupon {code} — 10% off").replace("{code}", couponApplied ?? "")}</span>
                    <button type="button" onClick={() => { setCouponApplied(null); update("coupon", ""); }}
                      className="underline text-muted-foreground">{t("commerce.checkout.remove", "Remove")}</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      placeholder={t("commerce.cart.promoCode", "Promo code")}
                      value={form.coupon}
                      onChange={(e) => { update("coupon", e.target.value); clearErr("coupon"); }}
                      className={input(errors.coupon) + " flex-1"}
                    />
                    <button type="button" onClick={applyCoupon}
                      className="px-4 border hairline text-[10px] uppercase tracking-[0.18em] font-semibold hover:bg-forest hover:text-ivory">
                      {t("commerce.cart.apply", "Apply")}
                    </button>
                  </div>
                )}
                {errors.coupon && <div className="text-[11px] text-red-600 mt-1">{errors.coupon}</div>}
              </div>

              <div className="border-t hairline pt-4 space-y-2 text-sm font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("commerce.summary.subtotal", "Subtotal")}</span>
                  <span>{formatMoney(totals.subtotal, currency)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-forest">
                    <span>{t("commerce.summary.discount", "Discount")}</span>
                    <span>− {formatMoney(totals.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("commerce.checkout.shippingWithMethod", "Shipping ({method})").replace("{method}", ship)}</span>
                  <span>{totals.shipping === 0 ? t("commerce.summary.free", "Free") : formatMoney(totals.shipping, currency)}</span>
                </div>
                {totals.cod > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("commerce.checkout.codHandling", "COD handling")}</span>
                    <span>{formatMoney(totals.cod, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("commerce.summary.taxes", "Taxes")}</span>
                  <span>{t("commerce.summary.incl", "Incl.")}</span>
                </div>
                <div className="flex justify-between pt-3 border-t hairline text-base font-bold">
                  <span>{t("commerce.summary.total", "Total")}</span>
                  <span>{formatMoney(totals.total, currency)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t hairline space-y-1.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <div>— {t("commerce.checkout.encryptedCheckout", "Encrypted checkout")}</div>
                <div>— {t("commerce.checkout.authenticityVerified", "Authenticity verified")}</div>
                <div>— {t("commerce.checkout.exchangeWindow", "7-day exchange window")}</div>
              </div>

              <div className="mt-6">
                <CustomerQuote compact />
              </div>


              <div className="mt-6 lg:hidden">
                <SubmitButton submitting={submitting} label={`${isMoyasar ? t("commerce.checkout.paySecurely", "Pay securely") : t("commerce.checkout.placeOrder", "Place order")} — ${formatMoney(totals.total, currency)}`} />
              </div>

              <Link
                to="/cart"
                className="mt-4 block text-center text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 text-muted-foreground hover:text-forest"
              >
                {t("commerce.checkout.returnToCart", "← Return to cart")}
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}

/* ---------- Sub-components ---------- */

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border hairline bg-paper">
      <div className="flex items-baseline gap-4 px-6 md:px-8 pt-6 md:pt-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-forest/50">Step · {step}</span>
        <h2 className="font-serif text-xl md:text-2xl">{title}</h2>
      </div>
      <div className="p-6 md:p-8 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block" data-error={error ? "true" : undefined}>
      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest/70 block mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="block mt-1 text-[11px] text-red-600">{error}</span>}
    </label>
  );
}

function input(error?: string) {
  return `w-full border hairline h-11 px-3 bg-paper text-sm focus:outline-none focus:border-forest ${
    error ? "border-red-500" : ""
  }`;
}

function ShipOption({ active, onClick, title, meta, price }: {
  active: boolean; onClick: () => void; title: string; meta: string; price: string;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center justify-between p-4 border hairline text-left transition-colors ${
        active ? "bg-forest text-ivory border-forest" : "bg-paper hover:bg-ivory"
      }`}>
      <div className="flex items-center gap-4">
        <span className={`w-4 h-4 border ${active ? "border-ivory bg-ivory" : "border-forest/40"} shrink-0`} />
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className={`text-[11px] ${active ? "text-ivory/70" : "text-muted-foreground"}`}>{meta}</div>
        </div>
      </div>
      <span className="text-sm font-mono tabular-nums font-semibold">{price}</span>
    </button>
  );
}

function PayTab({ active, onClick, disabled, children }: {
  active: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`py-3 text-[11px] uppercase tracking-[0.16em] font-semibold border hairline transition-colors ${
        disabled
          ? "bg-paper text-muted-foreground/40 cursor-not-allowed"
          : active
            ? "bg-forest text-ivory border-forest"
            : "bg-paper hover:bg-ivory"
      }`}>
      {children}
    </button>
  );
}

function SubmitButton({ submitting, label }: { submitting: boolean; label: string }) {
  return (
    <button type="submit" disabled={submitting}
      className="w-full bg-forest text-ivory py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-forest/90 disabled:opacity-60">
      {submitting ? label /* placeholder */ : label}
    </button>
  );
}
