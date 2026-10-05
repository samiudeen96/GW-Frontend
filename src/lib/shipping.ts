/**
 * Shipping rates — country-wise
 * Purpose: single source of truth for per-country shipping fees, free-shipping
 * thresholds and delivery windows, sourced from the Green Wealth operations data.
 * Users: storefront (PDP, cart, checkout, country landing pages), SEO shipping schema.
 * Key actions: lookupShipping(countryCode), shippingCopy(rule).
 * Integration points: replace this static table with an ERP/commerce adapter later.
 */

export type ShippingRule = {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  /** Flat shipping fee in the country's currency. */
  fee: number;
  /** Order subtotal above which shipping is free. null = never free. */
  freeOver: number | null;
  days: string;
};

export const SHIPPING_RULES: ShippingRule[] = [
  { code: "AF", name: "Afghanistan", currency: "AFN", symbol: "Afs", fee: 300, freeOver: 2000, days: "2\u20135 business days" },
  { code: "AL", name: "Albania", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "DZ", name: "Algeria", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AS", name: "American Samoa", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AD", name: "Andorra", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AO", name: "Angola", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AI", name: "Anguilla", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AQ", name: "Antarctica", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AG", name: "Antigua and Barbuda", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AR", name: "Argentina", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AM", name: "Armenia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AW", name: "Aruba", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "AU$", fee: 40, freeOver: 110, days: "2\u20135 business days" },
  { code: "AT", name: "Austria", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "AZ", name: "Azerbaijan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BS", name: "Bahamas", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BH", name: "Bahrain", currency: "BHD", symbol: "BD", fee: 2, freeOver: 6, days: "1\u20133 business days" },
  { code: "BD", name: "Bangladesh", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BB", name: "Barbados", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BY", name: "Belarus", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BE", name: "Belgium", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "BZ", name: "Belize", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BJ", name: "Benin", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BM", name: "Bermuda", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BT", name: "Bhutan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BO", name: "Bolivia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BA", name: "Bosnia and Herzegovina", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BW", name: "Botswana", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BV", name: "Bouvet Island", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BR", name: "Brazil", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IO", name: "British Indian Ocean Territory", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BN", name: "Brunei Darussalam", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BG", name: "Bulgaria", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "BF", name: "Burkina Faso", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BI", name: "Burundi", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KH", name: "Cambodia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CM", name: "Cameroon", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "CA$", fee: 35, freeOver: 95, days: "2\u20135 business days" },
  { code: "CV", name: "Cape Verde", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KY", name: "Cayman Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CF", name: "Central African Republic", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TD", name: "Chad", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CL", name: "Chile", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CN", name: "China", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CX", name: "Christmas Island", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CC", name: "Cocos (Keeling) Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CO", name: "Colombia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KM", name: "Comoros", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CG", name: "Congo", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CK", name: "Cook Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CR", name: "Costa Rica", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HR", name: "Croatia", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "CU", name: "Cuba", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CW", name: "Cura\u00e7ao", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CY", name: "Cyprus", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "CZ", name: "Czech Republic", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "CI", name: "C\u00f4te d'Ivoire", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "CD", name: "Democratic Republic of the Congo", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "DK", name: "Denmark", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "DJ", name: "Djibouti", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "DM", name: "Dominica", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "DO", name: "Dominican Republic", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "EC", name: "Ecuador", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "EG", name: "Egypt", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SV", name: "El Salvador", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GQ", name: "Equatorial Guinea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ER", name: "Eritrea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "EE", name: "Estonia", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "SZ", name: "Eswatini", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ET", name: "Ethiopia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "FK", name: "Falkland Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "FO", name: "Faroe Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "FJ", name: "Fiji", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "FI", name: "Finland", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "FR", name: "France", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "GF", name: "French Guiana", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PF", name: "French Polynesia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TF", name: "French Southern Territories", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GA", name: "Gabon", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GM", name: "Gambia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GE", name: "Georgia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "DE", name: "Germany", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "GH", name: "Ghana", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GI", name: "Gibraltar", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GR", name: "Greece", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "GL", name: "Greenland", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GD", name: "Grenada", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GP", name: "Guadeloupe", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GU", name: "Guam", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GT", name: "Guatemala", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GG", name: "Guernsey", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GN", name: "Guinea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GW", name: "Guinea-Bissau", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GY", name: "Guyana", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HT", name: "Haiti", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HM", name: "Heard Island and McDonald Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VA", name: "Holy See (Vatican City State)", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HN", name: "Honduras", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HK", name: "Hong Kong", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "HU", name: "Hungary", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "IS", name: "Iceland", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "IN", name: "India", currency: "INR", symbol: "\u20b9", fee: 300, freeOver: 600, days: "2\u20134 business days" },
  { code: "ID", name: "Indonesia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IR", name: "Iran", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IQ", name: "Iraq", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IE", name: "Ireland", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "IM", name: "Isle Of Man", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IL", name: "Israel", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "IT", name: "Italy", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "JM", name: "Jamaica", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "JP", name: "Japan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "JE", name: "Jersey", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "JO", name: "Jordan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KZ", name: "Kazakhstan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KE", name: "Kenya", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KI", name: "Kiribati", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "XK", name: "Kosovo", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KW", name: "Kuwait", currency: "KWD", symbol: "KWD", fee: 1.5, freeOver: 4.5, days: "1\u20133 business days" },
  { code: "KG", name: "Kyrgyzstan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LA", name: "Laos", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LV", name: "Latvia", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "LB", name: "Lebanon", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LS", name: "Lesotho", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LR", name: "Liberia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LY", name: "Libya", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LI", name: "Liechtenstein", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LT", name: "Lithuania", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "LU", name: "Luxembourg", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "MO", name: "Macao", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MG", name: "Madagascar", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MW", name: "Malawi", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MY", name: "Malaysia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MV", name: "Maldives", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ML", name: "Mali", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MT", name: "Malta", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "MH", name: "Marshall Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MQ", name: "Martinique", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MR", name: "Mauritania", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MU", name: "Mauritius", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "YT", name: "Mayotte", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MX", name: "Mexico", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "FM", name: "Micronesia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MD", name: "Moldova", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MC", name: "Monaco", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MN", name: "Mongolia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ME", name: "Montenegro", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MS", name: "Montserrat", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MA", name: "Morocco", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MZ", name: "Mozambique", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MM", name: "Myanmar", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NA", name: "Namibia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NR", name: "Nauru", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NP", name: "Nepal", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NL", name: "Netherlands", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "NC", name: "New Caledonia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NZ", name: "New Zealand", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NI", name: "Nicaragua", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NE", name: "Niger", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NG", name: "Nigeria", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NU", name: "Niue", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NF", name: "Norfolk Island", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KP", name: "North Korea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MK", name: "North Macedonia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MP", name: "Northern Mariana Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "NO", name: "Norway", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "OM", name: "Oman", currency: "OMR", symbol: "OMR", fee: 2, freeOver: 6, days: "1\u20133 business days" },
  { code: "PK", name: "Pakistan", currency: "PKR", symbol: "PKR", fee: 500, freeOver: null, days: "2\u20134 business days" },
  { code: "PW", name: "Palau", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PA", name: "Panama", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PG", name: "Papua New Guinea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PY", name: "Paraguay", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PE", name: "Peru", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PH", name: "Philippines", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PN", name: "Pitcairn Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PL", name: "Poland", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "PT", name: "Portugal", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "PR", name: "Puerto Rico", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "QA", name: "Qatar", currency: "QAR", symbol: "QR", fee: 20, freeOver: 60, days: "1\u20133 business days" },
  { code: "RO", name: "Romania", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "RU", name: "Russian Federation", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "RW", name: "Rwanda", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "RE", name: "R\u00e9union", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "BL", name: "Saint Barth\u00e9l\u00e9my", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KN", name: "Saint Kitts and Nevis", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "LC", name: "Saint Lucia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "MF", name: "Saint Martin (French part)", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PM", name: "Saint Pierre and Miquelon", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VC", name: "Saint Vincent and the Grenadines", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "WS", name: "Samoa", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SM", name: "San Marino", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "SAR", fee: 20, freeOver: 60, days: "1\u20133 business days" },
  { code: "SN", name: "Senegal", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "RS", name: "Serbia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SC", name: "Seychelles", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SL", name: "Sierra Leone", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$", fee: 34, freeOver: 95, days: "2\u20135 business days" },
  { code: "SX", name: "Sint Maarten (Dutch part)", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SK", name: "Slovakia", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "SI", name: "Slovenia", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "SB", name: "Solomon Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SO", name: "Somalia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ZA", name: "South Africa", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "KR", name: "South Korea", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SS", name: "South Sudan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ES", name: "Spain", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "LK", name: "Sri Lanka", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "PS", name: "State of Palestine", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SD", name: "Sudan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SR", name: "Suriname", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SJ", name: "Svalbard and Jan Mayen", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "SE", name: "Sweden", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "CH", name: "Switzerland", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "SY", name: "Syria", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ST", name: "S\u00e3o Tom\u00e9 and Pr\u00edncipe", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TW", name: "Taiwan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TJ", name: "Tajikistan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TZ", name: "Tanzania", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TH", name: "Thailand", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TL", name: "Timor-Leste", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TG", name: "Togo", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TK", name: "Tokelau", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TO", name: "Tonga", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TT", name: "Trinidad and Tobago", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TN", name: "Tunisia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TM", name: "Turkmenistan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TC", name: "Turks and Caicos Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TV", name: "Tuvalu", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "TR", name: "T\u00fcrkiye", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "UM", name: "USA Minor Outlying Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "UG", name: "Uganda", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "UA", name: "Ukraine", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "AED", fee: 20, freeOver: 40, days: "1\u20133 business days" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "\u00a3", fee: 20, freeOver: 55, days: "2\u20135 business days" },
  { code: "US", name: "United States", currency: "USD", symbol: "$", fee: 25, freeOver: 70, days: "2\u20135 business days" },
  { code: "UY", name: "Uruguay", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "UZ", name: "Uzbekistan", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VU", name: "Vanuatu", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VE", name: "Venezuela", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VN", name: "Vietnam", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VG", name: "Virgin Islands (British)", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "VI", name: "Virgin Islands (USA)", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "WF", name: "Wallis and Futuna", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "EH", name: "Western Sahara", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "YE", name: "Yemen", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ZM", name: "Zambia", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "ZW", name: "Zimbabwe", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" },
  { code: "AX", name: "\u00c5land Islands", currency: "USD", symbol: "$", fee: 40, freeOver: 120, days: "2\u20135 business days" }
];

const BY_CODE: Record<string, ShippingRule> = Object.fromEntries(
  SHIPPING_RULES.map((r) => [r.code, r]),
);

/** Default (rest of world) rule used when a country has no explicit entry. */
export const DEFAULT_SHIPPING: ShippingRule = {
  code: "ZZ",
  name: "Rest of world",
  currency: "USD",
  symbol: "$",
  fee: 40,
  freeOver: 120,
  days: "2\u20135 business days",
};

export function lookupShipping(countryCode?: string | null): ShippingRule {
  if (!countryCode) return DEFAULT_SHIPPING;
  return BY_CODE[countryCode.toUpperCase()] ?? DEFAULT_SHIPPING;
}

/** Human-readable one-liner, e.g. "AED 20 \u00b7 free over AED 40 \u00b7 1\u20133 business days". */
export function shippingCopy(rule: ShippingRule): string {
  const fee = `${rule.symbol}${rule.fee}`;
  const free = rule.freeOver === null ? "" : ` \u00b7 free over ${rule.symbol}${rule.freeOver}`;
  return `${fee}${free} \u00b7 ${rule.days}`;
}

/**
 * Currency-first lookup, used where we only know the shopper's selected
 * currency (cart drawer, bag page) and not their destination country.
 */
const BY_CURRENCY: Record<string, ShippingRule> = (() => {
  const map: Record<string, ShippingRule> = {};
  for (const r of SHIPPING_RULES) if (!map[r.currency]) map[r.currency] = r;
  // Eurozone destinations bill in USD upstream; mirror the EU band 1:1 in EUR.
  map.EUR = { code: "EU", name: "Eurozone", currency: "EUR", symbol: "€", fee: 25, freeOver: 70, days: "2–5 business days" };
  return map;
})();

export function shippingForCurrency(currency: string): ShippingRule {
  return BY_CURRENCY[currency.toUpperCase()] ?? DEFAULT_SHIPPING;
}

/**
 * Resolve the rule for a destination, preferring the country rule and falling
 * back to the currency band when the shopper prices in another currency.
 */
export function resolveShipping(countryCode: string | null | undefined, currency: string): ShippingRule {
  const byCountry = countryCode ? BY_CODE[countryCode.toUpperCase()] : undefined;
  if (byCountry && byCountry.currency === currency.toUpperCase()) return byCountry;
  const byCurrency = shippingForCurrency(currency);
  return byCountry ? { ...byCurrency, days: byCountry.days } : byCurrency;
}
