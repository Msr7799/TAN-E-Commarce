// ============================================================
// Firebase Auth Hook
// ============================================================

"use client";

import { useEffect, useState, useContext, createContext, ReactNode } from "react";
import { User } from "firebase/auth";
import {
  onAuthStateChange,
  getCurrentUser,
  logoutUser,
  handleRedirectResult,
} from "@/services/auth";
import { onUserProfileChange, setWishlist, UserProfile } from "@/services/user";
import { logger } from "@/lib/logger";
import { useWishlistStore } from "@/store/wishlistStore";

// ─────────────────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────
// Auth Provider
// ─────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChange(async (authUser) => {
      if (!isMounted) return;
      setUser(authUser);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (authUser) {
        const localWishlist = useWishlistStore.getState().productIds;

        unsubscribeProfile = onUserProfileChange(authUser.uid, async (profile) => {
          if (!isMounted) return;

          if (profile) {
            setUserProfile(profile);

            const profileWishlist = profile.wishlist || [];
            const mergedWishlist = Array.from(new Set([...profileWishlist, ...localWishlist]));

            if (mergedWishlist.length !== profileWishlist.length) {
              useWishlistStore.getState().setWishlist(mergedWishlist);
              try {
                await setWishlist(authUser.uid, mergedWishlist);
              } catch (error) {
                logger.error("Failed to merge local wishlist with profile", {
                  error: String(error),
                });
              }
            } else {
              useWishlistStore.getState().setWishlist(profileWishlist);
            }
          } else {
            setUserProfile(null);
          }
        });
      } else {
        setUserProfile(null);
        useWishlistStore.getState().clearWishlist();
      }

      setIsLoading(false);
    });

    const hasRedirectParams =
      typeof window !== "undefined" &&
      (window.location.search.includes("mode=signInWithRedirect") ||
        window.location.search.includes("code=") ||
        window.location.search.includes("oauth"));

    if (hasRedirectParams) {
      handleRedirectResult().catch((error) => {
        logger.error("Redirect auth completion failed", { error: String(error) });
      });
    }

    return () => {
      isMounted = false;
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      logger.error("Logout failed", { error: String(error) });
      throw error;
    } finally {
      useWishlistStore.getState().clearWishlist();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        isAuthenticated: !!user,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────
// useAuth Hook
// ─────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
