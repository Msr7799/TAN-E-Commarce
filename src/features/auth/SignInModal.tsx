"use client";

import { useState } from "react";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 transition hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
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
                className="flex h-16 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-0 transition disabled:opacity-50"
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
                    className="h-12 w-auto"
                  />
                )}
              </button>

              {/* Apple */}
              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="flex h-16 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-0 transition disabled:opacity-50"
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
                    className="h-15 w-40"
                  />
                )}
              </button>

              {/* Anonymous */}
              <button
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4" opacity="0.8" />
                    <path d="M12 14c-4 0-8 2-8 4v4h16v-4c0-2-4-4-8-4z" opacity="0.8" />
                  </svg>
                )}
                {t("auth.signInAnon") || "Continue as Guest"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-500">{t("auth.or") || "OR"}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-600">
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
