// ============================================================
// User Data Management Service (Realtime Database)
// ============================================================

import { ref, set, get, update, push, remove, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  currency: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAnonymous: boolean;
  isAdmin: boolean;
  isOnline: boolean;
  createdAt: string;
  lastLogin: string;
  language: "en" | "ar";
  currency: string;
  interests: string[];
  wishlist: string[];
  purchaseHistory: PurchaseItem[];
}

// ─────────────────────────────────────────────────────────
// Get User Profile
// ─────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    return snapshot.exists() ? (snapshot.val() as UserProfile) : null;
  } catch (error) {
    logger.error("Failed to fetch user profile", { uid, error: String(error) });
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Update User Language & Currency
// ─────────────────────────────────────────────────────────

export async function updateUserLanguage(uid: string, language: "en" | "ar") {
  try {
    await update(ref(db, `users/${uid}`), { language });
  } catch (error) {
    logger.error("Failed to update language", { uid, error: String(error) });
    throw error;
  }
}

export async function updateUserCurrency(uid: string, currency: string) {
  try {
    await update(ref(db, `users/${uid}`), { currency });
  } catch (error) {
    logger.error("Failed to update currency", { uid, error: String(error) });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Interests Management
// ─────────────────────────────────────────────────────────

export async function addInterest(uid: string, interest: string) {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const user = snapshot.val() as UserProfile;
    const interests = user.interests || [];

    if (!interests.includes(interest)) {
      interests.push(interest);
      await update(userRef, { interests });
    }
  } catch (error) {
    logger.error("Failed to add interest", { uid, interest, error: String(error) });
    throw error;
  }
}

export async function removeInterest(uid: string, interest: string) {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const user = snapshot.val() as UserProfile;
    const interests = (user.interests || []).filter((i) => i !== interest);

    await update(userRef, { interests });
  } catch (error) {
    logger.error("Failed to remove interest", { uid, interest, error: String(error) });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Wishlist Management
// ─────────────────────────────────────────────────────────

export async function addToWishlist(uid: string, productId: string) {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const user = snapshot.val() as UserProfile;
    const wishlist = user.wishlist || [];

    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      await update(userRef, { wishlist });
    }
  } catch (error) {
    logger.error("Failed to add to wishlist", { uid, productId, error: String(error) });
    throw error;
  }
}

export async function removeFromWishlist(uid: string, productId: string) {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const user = snapshot.val() as UserProfile;
    const wishlist = (user.wishlist || []).filter((id) => id !== productId);

    await update(userRef, { wishlist });
  } catch (error) {
    logger.error("Failed to remove from wishlist", { uid, productId, error: String(error) });
    throw error;
  }
}
export async function setWishlist(uid: string, wishlist: string[]) {
  try {
    await update(ref(db, `users/${uid}`), { wishlist });
  } catch (error) {
    logger.error("Failed to set wishlist", { uid, wishlist, error: String(error) });
    throw error;
  }
}
// ─────────────────────────────────────────────────────────
// Purchase History
// ─────────────────────────────────────────────────────────

export async function addPurchase(uid: string, purchase: Omit<PurchaseItem, "id">) {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const user = snapshot.val() as UserProfile;
    const purchaseHistory = user.purchaseHistory || [];

    const newPurchase: PurchaseItem = {
      ...purchase,
      id: push(ref(db)).key || "",
    };

    purchaseHistory.push(newPurchase);
    await update(userRef, { purchaseHistory });
  } catch (error) {
    logger.error("Failed to add purchase", { uid, error: String(error) });
    throw error;
  }
}

export async function getPurchaseHistory(uid: string): Promise<PurchaseItem[]> {
  try {
    const snapshot = await get(ref(db, `users/${uid}/purchaseHistory`));
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    logger.error("Failed to fetch purchase history", { uid, error: String(error) });
    return [];
  }
}

// ─────────────────────────────────────────────────────────
// Online Status
// ─────────────────────────────────────────────────────────

export async function setOnlineStatus(uid: string, isOnline: boolean) {
  try {
    await update(ref(db, `users/${uid}`), {
      isOnline,
      lastLogin: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to update online status", { uid, error: String(error) });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Real-time Listeners
// ─────────────────────────────────────────────────────────

export function onUserProfileChange(uid: string, callback: (profile: UserProfile | null) => void) {
  const userRef = ref(db, `users/${uid}`);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as UserProfile);
    } else {
      callback(null);
    }
  });

  return () => off(userRef);
}

// ─────────────────────────────────────────────────────────
// Admin Management
// ─────────────────────────────────────────────────────────

export async function setAdminStatus(uid: string, isAdmin: boolean) {
  try {
    await update(ref(db, `users/${uid}`), { isAdmin });
  } catch (error) {
    logger.error("Failed to update admin status", { uid, error: String(error) });
    throw error;
  }
}
