"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, X } from "lucide-react";
import { signInWithGoogle, signInWithApple, signInAsAnonymous } from "@/services/auth";
import { trackLogin } from "@/lib/analytics";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Lock background scroll while the sheet/modal is open — important on mobile
  // where the page behind can otherwise scroll under the overlay.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      trackLogin("google");
      toast.success(t("auth.signInSuccess") || "Signed in successfully!");
      onClose();
    } catch {
      toast.error(t("auth.signInError") || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
      trackLogin("apple");
      toast.success(t("auth.signInSuccess") || "Signed in successfully!");
      onClose();
    } catch {
      toast.error(t("auth.signInError") || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setIsLoading(true);
      await signInAsAnonymous();
      trackLogin("anonymous");
      toast.success(t("auth.anonSignInSuccess") || "Browsing as guest");
      onClose();
    } catch {
      toast.error(t("auth.signInError") || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // items-end -> on phones the sheet docks to the bottom (native pattern).
          // sm:items-center -> on tablet/desktop it becomes a centered dialog.
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            // Bottom-sheet corners + no bottom radius on mobile, full rounded card from sm up.
            // max-h + overflow-y-auto keeps the sheet usable in landscape / small-height phones.
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t("auth.signIn") || "Sign In"}
          >
            {/* Drag handle — mobile-only affordance signaling "this is a sheet, swipe area" */}
            <div className="mb-2 flex justify-center sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-gray-300" aria-hidden="true" />
            </div>

            {/* Close Button — larger hit area for touch, kept clear of the drag handle */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 rounded-full p-2.5 transition hover:bg-gray-100 active:bg-gray-200 sm:top-4 sm:right-4"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="mb-6 text-center sm:mb-8">
              <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                {t("auth.signIn") || "Sign In"}
              </h2>
              <p className="text-sm text-gray-600">
                {t("auth.signInDesc") || "Choose your preferred sign-in method"}
              </p>
            </div>

            {/* Sign In Options */}
            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-0 transition active:scale-[0.98] disabled:opacity-50 sm:h-16"
                aria-label="Sign in with Google"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Image
                    src="/google-login-button.svg"
                    alt="Sign in with Google"
                    width={200}
                    height={48}
                    className="h-10 w-auto sm:h-12"
                  />
                )}
              </button>

              {/* Apple */}
              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-0 transition active:scale-[0.98] disabled:opacity-50 sm:h-16"
                aria-label="Sign in with Apple"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Image
                    src="/apple-login-button.png"
                    alt="Sign in with Apple"
                    width={160}
                    height={48}
                    className="h-10 w-auto sm:h-12"
                  />
                )}
              </button>

              {/* Anonymous */}
              <button
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="flex min-h-[3rem] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50 sm:text-base"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4" opacity="0.8" />
                    <path d="M12 14c-4 0-8 2-8 4v4h16v-4c0-2-4-4-8-4z" opacity="0.8" />
                  </svg>
                )}
                {t("auth.signInAnon") || "Continue as Guest"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4 sm:my-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-500">{t("auth.or") || "OR"}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Terms */}
            <p className="px-2 text-center text-xs leading-relaxed text-gray-600">
              {t("auth.agreeTerms") || "By signing in, you agree to our"}{" "}
              <a href="/privacy" className="text-golden hover:underline">
                {t("auth.privacyPolicy") || "Privacy Policy"}
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
