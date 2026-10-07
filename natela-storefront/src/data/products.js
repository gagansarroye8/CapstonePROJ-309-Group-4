/* ---------------------------------------------------------
   FAKE DATA — stands in for product-service until it is live.

   When the real API is ready, delete this file and fetch the
   same shape from the gateway instead. Keep the field names
   identical to whatever the backend team agrees on, so the
   swap is a one-line change in ProductsContext.jsx.
   --------------------------------------------------------- */

export const SIZES = ["S", "M", "L", "XL"];

export const products = [
  {
    id: 1,
    name: "Flame Muay Thai Shorts",
    sku: "NF-FLM-001",
    description:
      "Satin-finish Muay Thai shorts with the Natela gradient across the leg. Four-way stretch side panel and a wide elastic waistband that stays put.",
    price: 92,
    comparePrice: null,
    sport: "Muay Thai",
    rating: 4.8,
    reviews: 61,
    tag: "NEW",
    image: null, // client photography goes here
    stock: { S: 6, M: 4, L: 9, XL: 0 },
    status: "live",
  },
  {
    id: 2,
    name: "Classic Shorts — Black",
    sku: "NF-CLS-002",
    description:
      "The everyday pair. Matte black with a tonal waistband and the NE mark at the hem.",
    price: 84,
    comparePrice: null,
    sport: "Muay Thai",
    rating: 4.9,
    reviews: 118,
    tag: null,
    image: null,
    stock: { S: 12, M: 15, L: 11, XL: 7 },
    status: "live",
  },
  {
    id: 3,
    name: "Sunrise Shorts — Gold",
    sku: "NF-SUN-003",
    description:
      "Gold-to-orange fade with a contrast trim. Cut a touch shorter for high-kick clearance.",
    price: 92,
    comparePrice: null,
    sport: "Muay Thai",
    rating: 4.7,
    reviews: 34,
    tag: null,
    image: null,
    stock: { S: 0, M: 3, L: 2, XL: 0 },
    status: "live",
  },
  {
    id: 4,
    name: "Training Shorts — Mono",
    sku: "NF-TRN-004",
    description:
      "Lightweight training pair for pad work and conditioning. Quick-dry, no lining.",
    price: 78,
    comparePrice: null,
    sport: "Training",
    rating: 4.6,
    reviews: 52,
    tag: null,
    image: null,
    stock: { S: 8, M: 10, L: 6, XL: 5 },
    status: "live",
  },
  {
    id: 5,
    name: "Heritage Shorts — Red",
    sku: "NF-HTG-005",
    description:
      "Traditional cut in brand red with a woven waistband label.",
    price: 64,
    comparePrice: 92,
    sport: "Muay Thai",
    rating: 4.8,
    reviews: 77,
    tag: null,
    image: null,
    stock: { S: 2, M: 4, L: 1, XL: 3 },
    status: "live",
  },
  {
    id: 6,
    name: "Team Shorts — Navy",
    sku: "NF-TEM-006",
    description: "Club-ready navy pair. Bulk pricing available on request.",
    price: 58,
    comparePrice: 84,
    sport: "Boxing",
    rating: 4.5,
    reviews: 29,
    tag: null,
    image: null,
    stock: { S: 9, M: 9, L: 9, XL: 9 },
    status: "live",
  },
  {
    id: 7,
    name: "Everyday Shorts — Slate",
    sku: "NF-EVD-007",
    description: "Muted slate with a subtle tonal gradient. Gym to street.",
    price: 61,
    comparePrice: 78,
    sport: "Training",
    rating: 4.7,
    reviews: 41,
    tag: null,
    image: null,
    stock: { S: 5, M: 6, L: 2, XL: 4 },
    status: "live",
  },
  {
    id: 8,
    name: "Pro Shorts — Championship",
    sku: "NF-PRO-008",
    description: "Not released yet. Draft entry for the November drop.",
    price: 118,
    comparePrice: null,
    sport: "MMA",
    rating: 0,
    reviews: 0,
    tag: null,
    image: null,
    stock: { S: 0, M: 0, L: 0, XL: 0 },
    status: "draft",
  },
];

export const sports = [
  { name: "Muay Thai", slug: "muay-thai" },
  { name: "Boxing", slug: "boxing" },
  { name: "MMA", slug: "mma" },
  { name: "Training", slug: "training" },
];

export const helpLinks = [
  { title: "Size guide", sub: "Measurements and fit notes for every cut" },
  { title: "Shipping", sub: "Worldwide delivery times and costs" },
  { title: "Returns", sub: "30 days, unworn, tags attached" },
  { title: "FAQ", sub: "Care, fabric and order questions" },
];
