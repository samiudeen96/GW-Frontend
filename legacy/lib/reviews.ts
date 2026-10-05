// Centralized reviews data — used across homepage, PDP, cart, checkout, verify, footer.
// Images are served from Lovable CDN assets (zero third-party dependency).

import p01 from "@/assets/reviews/paradise-01.webp.asset.json";
import p02 from "@/assets/reviews/paradise-02.webp.asset.json";
import p03 from "@/assets/reviews/paradise-03.webp.asset.json";
import p04 from "@/assets/reviews/paradise-04.webp.asset.json";
import p06 from "@/assets/reviews/paradise-06.webp.asset.json";
import p07 from "@/assets/reviews/paradise-07.webp.asset.json";
import pr10 from "@/assets/reviews/paradise-reviews-10.webp.asset.json";
import pr4 from "@/assets/reviews/paradise-reviews-4.webp.asset.json";
import pr5 from "@/assets/reviews/paradise-reviews-5.webp.asset.json";
import pr7 from "@/assets/reviews/paradise-reviews-7.webp.asset.json";
import pr8 from "@/assets/reviews/paradise-reviews-8.webp.asset.json";
import pr1 from "@/assets/reviews/paradise-reviews1.webp.asset.json";
import r01 from "@/assets/reviews/review-01.webp.asset.json";
import r02 from "@/assets/reviews/review-02.webp.asset.json";
import r03 from "@/assets/reviews/review-03.webp.asset.json";
import r04 from "@/assets/reviews/review-04.webp.asset.json";

export type Review = {
  name: string;
  country?: string;
  rating: 5 | 4 | 3;
  product: "Neo Hair Lotion" | "Neo Hair Shampoo" | "Ghori Rosemary Oil" | "Ghori Dermaroller";
  title: string;
  body: string;
  helpful?: number;
  image?: string;
};

export const reviews: Review[] = [
  { name: "Faisal M.", country: "Oman", rating: 5, product: "Neo Hair Lotion", title: "Excellent quality product", body: "Been using for 5 months and my barber noticed the difference before I did. Thicker, fuller hair with less shedding.", helpful: 14, image: p01.url },
  { name: "Ali N.", country: "Iraq", rating: 5, product: "Neo Hair Lotion", title: "My hair is growing back!", body: "After 4 months of consistent use, my bald spots are filling in. I cannot believe the transformation.", helpful: 16, image: pr5.url },
  { name: "Sameer", country: "UAE", rating: 5, product: "Neo Hair Lotion", title: "Really good product", body: "I am using this product since January last week and it's really good — my hair growth is back now.", helpful: 15, image: r03.url },
  { name: "Tariq A.", country: "Pakistan", rating: 5, product: "Neo Hair Lotion", title: "Life changing product", body: "I cannot express how happy I am with this product. My confidence is back and my hair looks amazing.", helpful: 13, image: pr1.url },
  { name: "Hasir Ishag", country: "Canada", rating: 5, product: "Neo Hair Lotion", title: "This product is very great", body: "It is really working and gives you new hair as happened with me after using it for 2 months.", helpful: 12, image: r01.url },
  { name: "Ravi P.", country: "India", rating: 5, product: "Neo Hair Lotion", title: "Best hair product I have used", body: "I was skeptical at first but after seeing the results I am a believer. My hairline has improved significantly.", helpful: 11, image: p03.url },
  { name: "Varun Das", country: "UAE", rating: 5, product: "Neo Hair Lotion", title: "Amazing results!", body: "This is magic for hair growing — I use it day and night every day for the past month and I notice my baby hair.", helpful: 10, image: r04.url },
  { name: "Mohammad R.", country: "Kuwait", rating: 5, product: "Neo Hair Lotion", title: "Great for hair growth", body: "After trying many products, Neo Hair Lotion is the only one that actually worked. I can see new hair growing in areas that were thinning.", helpful: 9, image: p06.url },
  { name: "Rajesh M.", country: "India", rating: 5, product: "Neo Hair Lotion", title: "Worth every penny", body: "Invested in the genuine product and it paid off. My hair is noticeably thicker and healthier after regular use.", helpful: 8, image: pr4.url },
  { name: "Yousaf Ali", country: "UAE", rating: 5, product: "Neo Hair Lotion", title: "It has great result!", body: "Using it since 4 months now. Great result — my hairs started growing again. I recommend at least 4 to 6 months.", helpful: 8, image: r02.url },
  { name: "Sanjay V.", country: "India", rating: 5, product: "Neo Hair Lotion", title: "Authentic and effective", body: "Bought from Green Wealth directly and the product is authentic. Results are visible and I am very happy.", helpful: 7, image: pr7.url },
  { name: "Khalid S.", country: "Bahrain", rating: 5, product: "Neo Hair Lotion", title: "Noticeable difference in 2 months", body: "Within 2 months I could see baby hairs growing. Very impressed with the quality.", helpful: 7, image: p04.url },
  { name: "Ahmed K.", country: "Saudi Arabia", rating: 5, product: "Neo Hair Lotion", title: "Highly recommend!", body: "I have been using Neo Hair Lotion for 3 months and the results are incredible. My hair is thicker and healthier than ever before.", helpful: 6, image: p07.url },
  { name: "Hamid A.", rating: 5, product: "Neo Hair Lotion", title: "Original — great service", body: "Great service. What I watched after order delivered was the same as described. Great website for shopping.", helpful: 5 },
  { name: "Omar H.", country: "Qatar", rating: 5, product: "Neo Hair Lotion", title: "Works as promised", body: "Genuine product with genuine results. Hair fall has reduced dramatically and new growth is visible.", helpful: 5, image: p02.url },
  { name: "Arun K.", country: "India", rating: 5, product: "Neo Hair Lotion", title: "Visible results in weeks", body: "I started seeing small baby hairs within the first few weeks. After 3 months, the improvement is dramatic.", helpful: 4, image: pr10.url },
  { name: "Hassan B.", country: "Jordan", rating: 5, product: "Neo Hair Lotion", title: "Reduced hair fall significantly", body: "My hair fall has reduced by at least 80% since I started using Neo Hair Lotion. Very satisfied with this purchase.", helpful: 3, image: pr8.url },
  { name: "Ahmed F.", rating: 5, product: "Neo Hair Lotion", title: "It's the original", body: "Just started using it but I can feel it — it's original. I do recommend it. Delivered on time.", helpful: 4 },
  { name: "Abdul Basit P.", rating: 4, product: "Neo Hair Lotion", title: "Effective — be patient", body: "Effective but you have to be patient. It took 1 month before I saw the changes in my hair.", helpful: 6 },
  { name: "Sanaa R.", rating: 4, product: "Neo Hair Lotion", title: "Consistent results", body: "It's good and shows results after a period of consistent use. It's not the first time I've ordered it.", helpful: 3 },
];

export const stats = { rating: 4.7, count: 430692, reviews: 1407, countries: 90, verified: 100, customers: "2M+" };

// Distribution scaled to match stats.count (430,692) — weighted avg = 4.7★.
export const distribution = [
  { stars: 5, count: 342619 },
  { stars: 4, count: 62087 },
  { stars: 3, count: 25902 },
  { stars: 2, count: 43 },
  { stars: 1, count: 41 },
];

export const productStats = [
  { name: "Neo Hair Lotion", slug: "neo-hair-lotion" as const, rating: 4.7, count: 288943 },
  { name: "Ghori Dermaroller", slug: "ghori-dermaroller" as const, rating: 4.7, count: 87596 },
  { name: "Neo Hair Shampoo", slug: "neo-hair-shampoo" as const, rating: 4.9, count: 34568 },
  { name: "Ghori Rosemary Oil", slug: "ghori-rosemary-oil" as const, rating: 4.9, count: 19585 },
];
