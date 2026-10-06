declare namespace App {
  interface Locals {
    /** Active locale, from the URL prefix (`/ar/...`). */
    locale: import("@/lib/i18n/locale").Locale;
    /** Locale-agnostic pathname (`/ar/shop` -> `/shop`). */
    pathname: string;
    /** Active currency code, from the `gw-currency` cookie. */
    currency: string;
  }
}
