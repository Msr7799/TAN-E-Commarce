// ============================================================
// Mock product data — replace with real API/database calls
// ============================================================
import type { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "marbella-set",
    name: "Marbella set SAVE 40%",
    shortDescription: "A complete tanning bundle: Coco + Deer Blood + Bronze.",
    description:
      "Get the ultimate Marbella Tan experience with our complete set. Contains one bottle of each of our premium tanning oils: Coco, Deer Blood, and Bronze. Highly moisturizing, safe for sensitive skin and face, and officially licensed by the Ministry of Health and the Ministry of Industry and Commerce in Bahrain.",
    price: 17.9,
    compareAtPrice: 29.4,
    currency: "BHD",
    images: [
      {
        id: "img-1-1",
        url: "/back3colors.webp",
        alt: "Marbella set",
        width: 752,
        height: 1410,
        isPrimary: true,
      },
    ],
    category: "bundles",
    tags: ["bestseller", "bundle", "complete-set"],
    rating: 4.9,
    reviewCount: 1420,
    stockStatus: "in_stock",
    stockCount: 50,
    sku: "MB-SET-01",
    isFeatured: true,
    isNew: false,
    discount: 40,
    specifications: [
      { label: "Includes", value: "Coco 100ml, Deer Blood 100ml, Bronze 100ml" },
      {
        label: "Licensing",
        value: "Ministry of Health & Ministry of Industry and Commerce (Bahrain)",
      },
      { label: "Skin Type", value: "All skin types, sensitive skin safe" },
      { label: "Vegan & Natural", value: "100% natural plant extracts" },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "2",
    slug: "twins-promo",
    name: "Twins promo SAVE 33%",
    shortDescription: "Choose your favorite combination of two Marbella Tan oils.",
    description:
      "Double the glow with our Twins Promo bundle. Mix and match any two Marbella Tan oils (e.g. Bronze + Coco) to achieve your custom, perfect tan shade. Safe, moisturizing, and licensed.",
    price: 13.2,
    compareAtPrice: 19.68,
    currency: "BHD",
    images: [
      {
        id: "img-2-1",
        url: "/orange&brown.webp",
        alt: "Twins promo",
        width: 752,
        height: 1410,
        isPrimary: true,
      },
    ],
    category: "bundles",
    tags: ["bundle", "promo", "twins"],
    rating: 4.8,
    reviewCount: 935,
    stockStatus: "in_stock",
    stockCount: 35,
    sku: "MB-TWN-02",
    isFeatured: true,
    isNew: true,
    discount: 33,
    specifications: [
      { label: "Quantity", value: "2 x 100ml bottles" },
      { label: "Licensing", value: "Ministry of Health (Bahrain)" },
      { label: "Flexibility", value: "Mix and match colors every 10-20 mins" },
    ],
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-06-05T00:00:00Z",
  },
  {
    id: "3",
    slug: "bronze-tanning-oil",
    name: "Bronze",
    shortDescription: "Glowing golden color with a striking shine.",
    description:
      "Marbella Tan Bronze Oil gives you a classic, glowing golden tan with a striking shimmering shine under the sun. Made from 100% natural ingredients, safe for sensitive skin and face.",
    price: 9.0,
    compareAtPrice: undefined,
    currency: "BHD",
    images: [
      {
        id: "img-3-1",
        url: "/orange.webp",
        alt: "Bronze Tanning Oil",
        width: 752,
        height: 1410,
        isPrimary: true,
      },
    ],
    hoverImage: {
      id: "img-3-hover",
      url: "/hover-gold.webp",
      alt: "Bronze Tanning Oil hover view",
      width: 360,
      height: 675,
      isPrimary: false,
    },
    category: "tanning-oil",
    tags: ["bronze", "shimmer", "golden"],
    rating: 4.7,
    reviewCount: 654,
    stockStatus: "in_stock",
    stockCount: 80,
    sku: "MB-BRZ-03",
    isFeatured: false,
    isNew: false,
    specifications: [
      { label: "Volume", value: "100ml" },
      { label: "Shade", value: "Golden / Shimmering" },
      { label: "Ingredients", value: "100% natural herbal extracts" },
      { label: "Sunscreen", value: "Built-in SPF" },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-05-15T00:00:00Z",
  },
  {
    id: "4",
    slug: "coco-tanning-oil",
    name: "Coco",
    shortDescription: "Deep, rich African chocolate tan.",
    description:
      "Marbella Tan Coco Oil delivers a deep, rich African chocolate tan with zero orange tones. Formulated with premium nourishing oils, 100% safe for sensitive skin and face.",
    price: 9.0,
    compareAtPrice: undefined,
    currency: "BHD",
    images: [
      {
        id: "img-4-1",
        url: "/brown.webp",
        alt: "Coco Tanning Oil",
        width: 941,
        height: 1672,
        isPrimary: true,
      },
    ],
    hoverImage: {
      id: "img-4-hover",
      url: "/hover-brown.webp",
      alt: "Coco Tanning Oil hover view",
      width: 360,
      height: 640,
      isPrimary: false,
    },
    category: "tanning-oil",
    tags: ["coco", "dark", "chocolate"],
    rating: 4.8,
    reviewCount: 1120,
    stockStatus: "in_stock",
    stockCount: 65,
    sku: "MB-COC-04",
    isFeatured: false,
    isNew: false,
    specifications: [
      { label: "Volume", value: "100ml" },
      { label: "Shade", value: "Dark Chocolate" },
      { label: "Ingredients", value: "100% natural herbal extracts" },
      { label: "Sunscreen", value: "Built-in SPF" },
    ],
    createdAt: "2024-04-20T00:00:00Z",
    updatedAt: "2024-06-10T00:00:00Z",
  },
  {
    id: "5",
    slug: "deer-blood-tanning-oil",
    name: "Deer Blood",
    shortDescription: "Vibrant tan with a natural healthy reddish glow.",
    description:
      "Marbella Tan Deer Blood Oil gives your skin a warm, healthy reddish-tinted tan. Deeply hydrating, 100% natural, and officially licensed by the Ministry of Health.",
    price: 9.0,
    compareAtPrice: undefined,
    currency: "BHD",
    images: [
      {
        id: "img-5-1",
        url: "/red.webp",
        alt: "Deer Blood Tanning Oil",
        width: 768,
        height: 1365,
        isPrimary: true,
      },
    ],
    hoverImage: {
      id: "img-5-hover",
      url: "/hover-red.webp",
      alt: "Deer Blood Tanning Oil hover view",
      width: 360,
      height: 675,
      isPrimary: false,
    },
    category: "tanning-oil",
    tags: ["deer-blood", "red", "warm"],
    rating: 4.9,
    reviewCount: 880,
    stockStatus: "in_stock",
    stockCount: 40,
    sku: "MB-DRB-05",
    isFeatured: false,
    isNew: false,
    specifications: [
      { label: "Volume", value: "100ml" },
      { label: "Shade", value: "Reddish Tan" },
      { label: "Ingredients", value: "100% natural herbal extracts" },
      { label: "Sunscreen", value: "Built-in SPF" },
    ],
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-06-08T00:00:00Z",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question:
      "I have tried many products and my skin is hard to tan, will Marbella Tan work for me?",
    answer:
      "Most customers who contact us have skin that is hard to tan, but after trying our products, the result is a positive shock to the customer! Marbella Tan is not just a product, it is a complete experience, because results start to appear in less than 20 minutes if you follow the correct steps.",
  },
  {
    id: "faq-2",
    question: "Which type of tan is best suited for my skin?",
    answer:
      "All our products suit different skin types and do not cause any adverse effects, and we are absolutely sure you will be satisfied with the result. You can choose based on your preferred shade:\n\nCoco: If you prefer a dark chocolate-like finish.\n\nDeer Blood: If you prefer a tan that leans towards a healthy red glow.\n\nBronze: If you prefer a glowing golden color with a striking shine.",
  },
  {
    id: "faq-3",
    question: "Why do you always recommend mixing the products?",
    answer:
      "Because we know that every customer has a specific shade they aim to achieve. For example, if you want a slightly reddish bronze glow, you can mix (Bronze + Deer Blood) and alternate usage every 10-20 minutes until you reach the ideal shade you imagine. Mixing gives you complete flexibility to achieve your custom color.",
  },
  {
    id: "faq-4",
    question: "How many people does one bottle last for?",
    answer:
      "The bottle size (100 ml) is designed to be highly suitable for one person to use intensively until they reach their desired tan. If used by two people, it might suffice, but it may run out quickly before achieving the desired results, so we always recommend a bottle per person.",
  },
  {
    id: "faq-5",
    question:
      "How long does it take for results to appear, is the product natural and safe, and do I need sunscreen before it?",
    answer:
      "Results start showing in less than 30 minutes in the worst-case scenario. Speed depends on sun intensity, so we recommend tanning between 11 AM and 2 PM (taking a break in the shade or water every 10 minutes to avoid burns).\n\nThe product is 100% natural, extracted from herbs and natural ingredients without any chemicals or accelerators (trusted and tested since 2020). It is completely safe for sensitive skin and the face, offers high hydration, and unifies body tone (we have over 1,000+ customer reviews on Instagram).\n\nNote: You do not need to apply sunscreen before it; the product's core formula already contains sunscreen, and applying any external sunscreen may reduce its effectiveness.",
  },
  {
    id: "faq-6",
    question:
      "Where are you located, and how long does delivery take to Bahrain and GCC countries?",
    answer:
      "Our shop is located in the Kingdom of Bahrain, and we ship to all GCC countries with quick one-click payment via Apple Pay:\n\nGCC Countries: Very fast shipping taking only 2 to 4 business days to reach your doorstep directly.\n\nWithin Bahrain: Delivery in less than 24 hours (daytime orders arrive same day, night orders next day). Our team will contact you via WhatsApp to coordinate timing.",
  },
  {
    id: "faq-7",
    question: "Is same-day delivery available within Bahrain?",
    answer:
      "Yes, we provide express delivery for our customers within the Kingdom of Bahrain under the following conditions:\n\nOrders before 4:00 PM: Our team will contact you directly via WhatsApp to coordinate a suitable time, and the order will be delivered on the same day as an extra quick service.\n\nOrders after 4:00 PM: Will be processed and delivered the next day.",
  },
  {
    id: "faq-8",
    question: "What is the correct method of use?",
    answer:
      "1. Wet your body first: Go into the sea or pool to hydrate your entire body with water.\n\n2. Distribute the tan: Apply the tan and spread it evenly all over your wet body.\n\n3. Sit in the sun (10 minutes): Sit under the sun for only 10 minutes (the goal is not to overheat your body).\n\n4. Cool your body: After 10 minutes, go back in the water to cool your body, and get back in the sun immediately without drying yourself off.\n\n5. Repeat the process: Continue repeating this cycle (10 minutes sun, then cooling in water) for 45 minutes total, you can increase time if you want a darker color.\n\n6. Alternate products (optional): If you have more than one type of tan, change the type every 10 minutes (always after the water cooling step).\n\n7. Refresh the oil: The tan washes off with water, so if you feel it faded, apply a small extra amount (typically 2 to 3 times throughout the session).\n\nGolden Tip: The best time to tan is 11:00 AM, and always remember that keeping water on your body is the secret to accelerating your color without fatigue!",
  },
  {
    id: "faq-9",
    question: "What is the difference between your products?",
    answer:
      "🤎 1. Coco\nResult: Deep and rich African tan.\nShade: Deep bronze leaning towards luxury chocolate.\nFeature: Gives skin a strong and attractive tan with zero orange tones.\n\n🩸 2. Deer Blood\nResult: Vibrant tan leaning towards natural redness.\nShade: Warm bronze with a noticeable healthy blush.\nFeature: Darkens skin beautifully and restores vitality and freshness.\n\n🌟 3. Bronze\nResult: Shimmering golden results.\nShade: Classic bright bronze.\nFeature: Gives the skin a striking, high shine under the sun that highlights your tan.",
  },
];
