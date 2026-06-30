// ============================================================
// Firebase Authentication Service
// ============================================================

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ref, set, get, update } from "firebase/database";
import { logger } from "@/lib/logger";

// Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.setCustomParameters({ prompt: "login" });
const ADMIN_EMAILS = new Set([
  "alromaihi2224@gmail.com",
  "bibf101academic@gmail.com",
  "mmalromaihi99@gmail.com",
]);

type FirebaseErrorLike = {
  code?: string;
  message?: string;
};

function isFirebaseError(error: unknown): error is FirebaseErrorLike {
  return typeof error === "object" && error !== null && "code" in error && "message" in error;
}

async function tryPopupOrRedirect(provider: GoogleAuthProvider | OAuthProvider) {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    const firebaseError = isFirebaseError(error) ? error : null;
    logger.error("Popup auth failed", {
      code: firebaseError?.code,
      message: firebaseError?.message || String(error),
    });

    if (
      firebaseError?.code === "auth/popup-blocked" ||
      firebaseError?.code === "auth/popup-closed-by-user"
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Sign In Methods
// ─────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  try {
    const result = await tryPopupOrRedirect(googleProvider);
    if (!result) return null;

    await createOrUpdateUserProfile(result.user);
    return result.user;
  } catch (error) {
    const firebaseError = isFirebaseError(error) ? error : null;
    logger.error("Google sign-in failed", {
      code: firebaseError?.code,
      message: firebaseError?.message || String(error),
    });
    throw error;
  }
}

export async function signInWithApple() {
  try {
    const result = await tryPopupOrRedirect(appleProvider);
    if (!result) return null;

    await createOrUpdateUserProfile(result.user);
    return result.user;
  } catch (error) {
    const firebaseError = isFirebaseError(error) ? error : null;
    logger.error("Apple sign-in failed", {
      code: firebaseError?.code,
      message: firebaseError?.message || String(error),
    });
    throw error;
  }
}

export async function signInAsAnonymous() {
  try {
    const result = await signInAnonymously(auth);
    await createOrUpdateUserProfile(result.user);
    return result.user;
  } catch (error) {
    const firebaseError = isFirebaseError(error) ? error : null;
    logger.error("Anonymous sign-in failed", {
      code: firebaseError?.code,
      message: firebaseError?.message || String(error),
    });
    throw error;
  }
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await createOrUpdateUserProfile(result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    const firebaseError = isFirebaseError(error) ? error : null;
    logger.error("Redirect sign-in result failed", {
      code: firebaseError?.code,
      message: firebaseError?.message || String(error),
    });
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Sign Out
// ─────────────────────────────────────────────────────────

export async function logoutUser() {
  const user = auth.currentUser;
  console.log("logoutUser called", {
    uid: user?.uid,
    email: user?.email,
    isAnonymous: user?.isAnonymous,
  });

  if (user) {
    try {
      await update(ref(db, `users/${user.uid}`), {
        isOnline: false,
        lastLogin: new Date().toISOString(),
      });
      console.log("logoutUser: updated user offline status", { uid: user.uid });
    } catch (error) {
      logger.warn("Unable to update offline status before logout", {
        error: String(error),
        uid: user.uid,
      });
    }
  } else {
    console.warn("logoutUser: no current Firebase user available before signOut");
  }

  try {
    await signOut(auth);
    console.log("logoutUser: signOut completed");
  } catch (error) {
    console.error("logoutUser: signOut failed", error);
    logger.error("Sign-out failed", { error: String(error) });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Create/Update User Profile
// ─────────────────────────────────────────────────────────

export async function createOrUpdateUserProfile(user: User) {
  try {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const existingData = snapshot.exists() ? snapshot.val() : null;
    const now = new Date().toISOString();

    const isAdmin = ADMIN_EMAILS.has(user.email ?? "") || existingData?.isAdmin === true;
    const userData = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || existingData?.displayName || "",
      photoURL: user.photoURL || existingData?.photoURL || "",
      isAnonymous: user.isAnonymous,
      isAdmin,
      isOnline: true,
      createdAt: existingData?.createdAt || now,
      lastLogin: now,
      language: existingData?.language || "en",
      currency: existingData?.currency || "BHD",
      interests: existingData?.interests || [],
      wishlist: existingData?.wishlist || [],
      purchaseHistory: existingData?.purchaseHistory || [],
    };

    if (snapshot.exists()) {
      await update(userRef, {
        ...userData,
        createdAt: existingData.createdAt,
      });
    } else {
      await set(userRef, userData);
    }
  } catch (error) {
    logger.error("Failed to create/update user profile", { error: String(error) });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// Auth State Observer
// ─────────────────────────────────────────────────────────

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}
