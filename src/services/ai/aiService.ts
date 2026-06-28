// ============================================================
// AI Personalization Service — Privacy-First Architecture
// Ready to connect to Gemini 2.5 Flash via Google AI Studio
// ============================================================
import type { AIRecommendation, SessionData, Product } from "@/types";
import { logger } from "@/lib/logger";
import { AI_ENABLED, AI_MAX_CONTEXT_ITEMS } from "@/constants";

// ——— Privacy guard — only runs with explicit consent ————
function requireConsent(hasConsent: boolean): void {
  if (!hasConsent) {
    throw new Error("AI features require explicit user consent.");
  }
}

// ——— Session data manager (in-memory, no personal data) ——
export class SessionDataManager {
  private data: SessionData = {
    viewedProducts: [],
    searchQueries: [],
    categoryInterests: [],
  };

  trackProductView(productId: string): void {
    if (!this.data.viewedProducts.includes(productId)) {
      this.data.viewedProducts = [
        productId,
        ...this.data.viewedProducts,
      ].slice(0, AI_MAX_CONTEXT_ITEMS);
    }
  }

  trackSearch(query: string): void {
    const clean = query.trim().toLowerCase();
    if (clean && !this.data.searchQueries.includes(clean)) {
      this.data.searchQueries = [clean, ...this.data.searchQueries].slice(
        0,
        AI_MAX_CONTEXT_ITEMS
      );
    }
  }

  trackCategoryInterest(
    category: SessionData["categoryInterests"][number]
  ): void {
    if (!this.data.categoryInterests.includes(category)) {
      this.data.categoryInterests = [
        category,
        ...this.data.categoryInterests,
      ].slice(0, AI_MAX_CONTEXT_ITEMS);
    }
  }

  getSessionData(): Readonly<SessionData> {
    return { ...this.data };
  }

  clearSession(): void {
    this.data = {
      viewedProducts: [],
      searchQueries: [],
      categoryInterests: [],
    };
  }
}

// ——— AI Service ——————————————————————————————————————
export class AIService {
  private readonly apiKey: string | undefined;
  private readonly isEnabled: boolean;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.isEnabled = AI_ENABLED;
  }

  // Get personalised product recommendations
  async getRecommendations(
    sessionData: SessionData,
    availableProducts: Product[],
    hasConsent: boolean
  ): Promise<AIRecommendation[]> {
    requireConsent(hasConsent);

    if (!this.isEnabled || !this.apiKey) {
      logger.info("AI disabled or no API key — using fallback recommendations");
      return this.getFallbackRecommendations(sessionData, availableProducts);
    }

    try {
      // Prepare a privacy-safe prompt — no personal data sent
      const prompt = this.buildRecommendationPrompt(sessionData, availableProducts);

      // TODO: Replace with actual Gemini API call when enabled
      // const genAI = new GoogleGenerativeAI(this.apiKey);
      // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      // const result = await model.generateContent(prompt);

      logger.info("AI recommendation prompt ready (Gemini not yet connected)", {
        promptLength: prompt.length,
      });

      return this.getFallbackRecommendations(sessionData, availableProducts);
    } catch (error) {
      logger.error("AI recommendation failed", { error: String(error) });
      return this.getFallbackRecommendations(sessionData, availableProducts);
    }
  }

  // Answer customer questions via chat
  async chat(
    message: string,
    hasConsent: boolean
  ): Promise<string> {
    requireConsent(hasConsent);

    if (!this.isEnabled || !this.apiKey) {
      return "AI chat is currently unavailable. Please contact us via WhatsApp for assistance.";
    }

    try {
      // TODO: Implement Gemini chat integration
      // Ensure system prompt restricts to product-related topics only
      logger.info("AI chat message received (Gemini not yet connected)");
      return "Thank you for your question! Our AI assistant is being set up. Meanwhile, please check our FAQ or contact us via WhatsApp.";
    } catch (error) {
      logger.error("AI chat failed", { error: String(error) });
      return "Sorry, I couldn't process your question. Please try again or contact our team.";
    }
  }

  // ——— Private helpers ——————————————————————————
  private buildRecommendationPrompt(
    sessionData: SessionData,
    products: Product[]
  ): string {
    return `You are a product recommendation assistant for a premium tanning products store.
Based ONLY on the following anonymous session data (no personal information), recommend up to 4 products.

Session data:
- Categories viewed: ${sessionData.categoryInterests.join(", ") || "none"}
- Recent searches: ${sessionData.searchQueries.join(", ") || "none"}
- Products viewed: ${sessionData.viewedProducts.length} items

Available product IDs: ${products.map((p) => p.id).join(", ")}

Return a JSON array of: { "productId": string, "reason": string, "confidence": number (0-1) }
Only recommend products the user hasn't seen. Max 4 recommendations.`;
  }

  private getFallbackRecommendations(
    sessionData: SessionData,
    products: Product[]
  ): AIRecommendation[] {
    // Simple rule-based fallback — recommend featured products not yet viewed
    return products
      .filter(
        (p) => p.isFeatured && !sessionData.viewedProducts.includes(p.id)
      )
      .slice(0, 4)
      .map((p) => ({
        productId: p.id,
        reason: "Popular choice among our customers",
        confidence: 0.7,
      }));
  }
}

// ——— Singleton instances ————————————————————————————
export const sessionDataManager = new SessionDataManager();
export const aiService = new AIService();
