// ============================================================
// Zod validation schemas
// ============================================================
import { z } from "zod";

// ——— Contact Form ——————————————————————————
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[a-zA-Z\s\u0080-\uFFFF'-]+$/, "Name contains invalid characters"),
  email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ——— Search Query ——————————————————————————
export const searchQuerySchema = z.object({
  q: z
    .string()
    .max(200, "Search query too long")
    .transform((val) => val.trim())
    .optional(),
  category: z
    .enum([
      "self-tanner",
      "tanning-lotion",
      "bronzer",
      "after-sun",
      "accessories",
      "bundles",
    ])
    .optional(),
  minPrice: z.coerce.number().min(0).max(10000).optional(),
  maxPrice: z.coerce.number().min(0).max(10000).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["featured", "price_asc", "price_desc", "rating", "newest"])
    .optional(),
  page: z.coerce.number().min(1).default(1),
});

export type SearchQueryValues = z.infer<typeof searchQuerySchema>;

// ——— Coupon Code ——————————————————————————
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code is too long")
    .toUpperCase()
    .regex(/^[A-Z0-9-_]+$/, "Invalid coupon code format"),
});

export type CouponValues = z.infer<typeof couponSchema>;

// ——— AI Consent ——————————————————————————
export const aiConsentSchema = z.object({
  hasConsented: z.boolean(),
  timestamp: z.string().datetime().optional(),
});

export type AIConsentValues = z.infer<typeof aiConsentSchema>;

// ——— Newsletter ——————————————————————————
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
