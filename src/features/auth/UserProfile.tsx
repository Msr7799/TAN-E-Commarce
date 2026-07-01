"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  updateUserLanguage,
  updateUserCurrency,
  getPurchaseHistory,
  PurchaseItem,
} from "@/services/user";
import { getProductsByIds } from "@/services/products";
import { motion } from "motion/react";
import { LogOut, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { useCurrency } from "@/utils/currency-provider";
import type { Product } from "@/types";
import type { CurrencyCode } from "@/utils/currency";
import Image from "next/image";

type ActiveTab = "profile" | "purchases" | "wishlist" | "settings";

export function UserProfile() {
  const router = useRouter();
  const { user, userProfile, logout, isLoading } = useAuth();
  const { t } = useTranslation();
  const { currency, supportedCurrencies, formatPrice, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const formatDate = (value?: string | null) => {
    if (!value) return t("profile.noData") || "No data";
    return new Date(value).toLocaleDateString();
  };

  const joinedDate = userProfile?.createdAt || user?.metadata?.creationTime || null;
  const lastLoginDate = userProfile?.lastLogin || user?.metadata?.lastSignInTime || null;
  const statusText = userProfile?.isOnline
    ? t("profile.online") || "Online"
    : t("profile.offline") || "Offline";
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("Attempting logout...", { uid: user?.uid, email: user?.email });
      await logout();
      console.log("Logout successful");
      toast.success(t("auth.loggedOut") || "Logged out successfully");
      router.replace("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(t("auth.logoutError") || "Failed to log out. Please try again.");
    }
  };

  const handleLoadPurchases = async () => {
    if (!user) return;
    try {
      setIsLoadingPurchases(true);
      const history = await getPurchaseHistory(user.uid);
      setPurchaseHistory(history);
    } catch (error) {
      console.error("Failed to load purchases", error);
      toast.error(t("profile.loadError") || "Failed to load purchases");
    } finally {
      setIsLoadingPurchases(false);
    }
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    try {
      setCurrency(currencyCode as CurrencyCode);
      if (!user) return;
      await updateUserCurrency(user.uid, currencyCode);
      toast.success(t("profile.currencyUpdated") || "Currency updated");
    } catch (error) {
      console.error("Currency update failed", error);
      toast.error(t("profile.updateError") || "Failed to update");
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchWishlist = async () => {
      if (!userProfile?.wishlist?.length) {
        if (!isCancelled) {
          setWishlistProducts([]);
        }
        return;
      }

      try {
        const products = await getProductsByIds(userProfile.wishlist);
        if (!isCancelled) {
          setWishlistProducts(products);
        }
      } catch (error) {
        console.error("Failed to load wishlist products", error);
        if (!isCancelled) {
          setWishlistProducts([]);
        }
      }
    };

    void fetchWishlist();

    return () => {
      isCancelled = true;
    };
  }, [userProfile?.wishlist]);

  useEffect(() => {
    if (userProfile?.currency && userProfile.currency !== currency.code) {
      setCurrency(userProfile.currency as CurrencyCode);
    }
  }, [userProfile?.currency, currency.code, setCurrency]);

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "profile", label: t("profile.tab") || "Profile", icon: "👤" },
    { id: "purchases", label: t("profile.purchases") || "Purchases", icon: "🛍️" },
    { id: "wishlist", label: t("profile.wishlist") || "Wishlist", icon: "❤️" },
    { id: "settings", label: t("profile.settings") || "Settings", icon: "⚙️" },
  ];

  const handleLanguageChange = async (lang: "en" | "ar") => {
    if (!user) return;
    try {
      await updateUserLanguage(user.uid, lang);
      toast.success(t("profile.languageUpdated") || "Language updated");
    } catch {
      toast.error(t("profile.updateError") || "Failed to update");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-4xl rounded-lg bg-white p-4 shadow-lg sm:p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={64}
              height={64}
              className="h-12 w-12 rounded-full sm:h-16 sm:w-16"
            />
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-2xl">
              {user.displayName || (userProfile?.isAnonymous ? "Guest User" : user.email)}
            </h1>
            <p className="text-xs text-gray-600 sm:text-sm">
              {userProfile?.isAdmin && "🔐 Administrator"}
              {userProfile?.isOnline && " • Online"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {userProfile?.isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-golden bg-golden/10 px-4 py-2 text-sm font-semibold text-golden transition hover:bg-golden/20"
            >
              {t("admin.openDashboard")}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            {t("auth.logout") || "Logout"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto border-b">
        <div className="flex gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition sm:px-4 sm:py-2 sm:text-sm ${
                activeTab === tab.id
                  ? "border-golden text-golden"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">Email</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.status") || "Status"}
              </label>
              <input
                type="text"
                value={statusText}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.joined") || "Joined"}
              </label>
              <input
                type="text"
                value={formatDate(joinedDate)}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.lastLogin") || "Last Login"}
              </label>
              <input
                type="text"
                value={formatDate(lastLoginDate)}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.language") || "Language"}
              </label>
              <input
                type="text"
                value={userProfile?.language || t("profile.noData") || "No data"}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.currency") || "Currency"}
              </label>
              <input
                type="text"
                value={currency.code}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.admin") || "Admin"}
              </label>
              <input
                type="text"
                value={userProfile?.isAdmin ? t("profile.yes") || "Yes" : t("profile.no") || "No"}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                {t("profile.wishlistCount") || "Wishlist Items"}
              </label>
              <input
                type="text"
                value={userProfile?.wishlist?.length ?? 0}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div>
          {purchaseHistory.length === 0 && !isLoadingPurchases ? (
            <div className="py-8 text-center sm:py-12">
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">
                {t("profile.noPurchases") || "No purchases yet"}
              </p>
              <button
                onClick={handleLoadPurchases}
                className="rounded-lg bg-golden px-3 py-2 text-xs font-semibold text-white transition hover:bg-golden/90 sm:px-4 sm:py-2 sm:text-sm"
              >
                {t("profile.loadPurchases") || "Load Purchases"}
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {purchaseHistory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-3 transition hover:bg-gray-50 sm:p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-golden sm:text-sm">
                        {item.price} {item.currency}
                      </p>
                      <p className="text-xs text-gray-600 sm:text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="space-y-3 sm:space-y-4">
          {wishlistProducts.length ? (
            <ul className="grid gap-3 sm:gap-4">
              {wishlistProducts.map((product) => (
                <li
                  key={product.id}
                  className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:gap-4 sm:rounded-2xl sm:p-4"
                >
                  <div className="h-24 w-full overflow-hidden rounded-lg sm:h-28 sm:w-28 sm:rounded-2xl">
                    <Image
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.name}
                      width={180}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                          {product.name}
                        </h3>
                        <p className="line-clamp-2 text-xs text-gray-500 sm:text-sm">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-golden sm:text-base">
                          {formatPrice(product.price)}
                        </p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-gray-400 line-through sm:text-sm">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                      <span>
                        {product.stockStatus === "in_stock"
                          ? t("profile.inStock") || "In stock"
                          : t("profile.outOfStock") || "Out of stock"}
                      </span>
                      <span>{product.rating.toFixed(1)} ★</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center sm:py-12">
              <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="text-sm text-gray-600 sm:text-base">
                {t("profile.noWishlist") || "No wishlist items yet."}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              {t("settings.language") || "Language"}
            </label>
            <div className="flex gap-2 sm:gap-3">
              {["en", "ar"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as "en" | "ar")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm ${
                    userProfile?.language === lang
                      ? "bg-golden text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {lang === "en" ? "English" : "العربية"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
              {t("settings.currency") || "Currency"}
            </label>
            <select
              onChange={(e) => handleCurrencyChange(e.target.value)}
              value={currency.code}
              className="w-full rounded-lg border border-beige bg-white px-3 py-2 text-xs font-medium focus:border-golden focus:ring-2 focus:ring-golden/30 focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {supportedCurrencies.map((currencyConfig) => (
                <option key={currencyConfig.code} value={currencyConfig.code}>
                  {currencyConfig.flag} {currencyConfig.code} - {currencyConfig.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
}
