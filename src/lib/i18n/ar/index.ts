/**
 * Arabic dictionary registry.
 *
 * Each page/feature owns a namespace file in this folder and is merged here, so
 * translation work can grow without touching a single monolithic file.
 */
import { arCommon } from "./common";
import { arHome } from "./home";
import { arShop } from "./shop";
import { arProduct } from "./product";
import { arProductNeo } from "./product-neo";
import { arProductGhori } from "./product-ghori";
import { arProductRouteA } from "./product-route-a";
import { arProductRouteB } from "./product-route-b";
import { arProductFillRmA } from "./product-fill-rm-a";
import { arProductFillRmB } from "./product-fill-rm-b";
import { arProductFillLotion } from "./product-fill-lotion";
import { arProductFillShampoo } from "./product-fill-shampoo";
import { arCommerce } from "./commerce";
import { arVerify } from "./verify";
import { arContent } from "./content";
import { arLegal } from "./legal";
import { arLegalNotice } from "./legal-notice";
import { arLegalTerms } from "./legal-terms";
import { arLegalPrivacy } from "./legal-privacy";
import { arLegalRefund } from "./legal-refund";
import { arLegalShipping } from "./legal-shipping";
import { arLegalCookie } from "./legal-cookie";
import { arMisc } from "./misc";
import { arContentFaq } from "./content-faq";
import { arProductFillGhoriMechanism } from "./product-fill-ghori-mechanism";
import { arGhoriSpecs } from "./ghori-specs";
import { arPdpExtra, arProductCategory } from "./pdp-extra";
import { arIngDataA } from "./ingdata-a";
import { arIngDataB } from "./ingdata-b";
import { arIngDataC } from "./ingdata-c";
import { arIngDataD } from "./ingdata-d";
import { arIngredientsPage, arIngredientsIndex } from "./ingredients-page";
import { arHairScience } from "./hair-science";
import { arReviewsData, arReviewPeople } from "./reviews-data";
import { arHowTo } from "./howto";
import { arCommerceStates } from "./commerce-states";
import { arBlogData } from "./blog-data";
import { arBlogIngredientBodies } from "./blog-ingredient-bodies";
import { arProductImageAlts } from "./product-image-alts";
import { arImageAlts } from "./image-alts";

export const AR_DICTIONARY: Record<string, string> = {
  ...arCommon,
  ...arHome,
  ...arShop,
  ...arProduct,
  ...arProductNeo,
  ...arProductGhori,
  ...arProductRouteA,
  ...arProductRouteB,
  ...arProductFillRmA,
  ...arProductFillRmB,
  ...arProductFillLotion,
  ...arProductFillShampoo,
  ...arCommerce,
  ...arVerify,
  ...arContent,
  ...arLegal,
  ...arLegalNotice,
  ...arLegalTerms,
  ...arLegalPrivacy,
  ...arLegalRefund,
  ...arLegalShipping,
  ...arLegalCookie,
  ...arMisc,
  ...arContentFaq,
  ...arPdpExtra,
  ...arProductCategory,
  ...arProductFillGhoriMechanism,
  ...arGhoriSpecs,
  ...arProductImageAlts,
  ...arImageAlts,
  ...arIngDataA,
  ...arIngDataB,
  ...arIngDataC,
  ...arIngDataD,
  ...arIngredientsPage,
  ...arIngredientsIndex,
  ...arHairScience,
  ...arHowTo,
  ...arReviewsData,
  ...arReviewPeople,
  ...arCommerceStates,
  ...arBlogData,
  ...arBlogIngredientBodies,
};
