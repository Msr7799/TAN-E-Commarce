"use client";

import { useEffect, useState } from "react";
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
import { LogOut, ShoppingBag, Heart, Settings } from "lucide-react";
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
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

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
    } catch {
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

      if (!isCancelled) {
        setIsLoadingWishlist(true);
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
      } finally {
        if (!isCancelled) {
          setIsLoadingWishlist(false);
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
    } catch (error) {
      toast.error(t("profile.updateError") || "Failed to update");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.displayName || (userProfile?.isAnonymous ? "Guest User" : user.email)}
            </h1>
            <p className="text-sm text-gray-600">
              {userProfile?.isAdmin && "🔐 Administrator"}
              {userProfile?.isOnline && " • Online"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          {t("auth.logout") || "Logout"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-2 font-medium transition ${
              activeTab === tab.id
                ? "border-golden text-golden"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.status") || "Status"}
              </label>
              <input
                type="text"
                value={statusText}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.joined") || "Joined"}
              </label>
              <input
                type="text"
                value={formatDate(joinedDate)}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.lastLogin") || "Last Login"}
              </label>
              <input
                type="text"
                value={formatDate(lastLoginDate)}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.language") || "Language"}
              </label>
              <input
                type="text"
                value={userProfile?.language || t("profile.noData") || "No data"}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.currency") || "Currency"}
              </label>
              <input
                type="text"
                value={currency.code}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.admin") || "Admin"}
              </label>
              <input
                type="text"
                value={userProfile?.isAdmin ? t("profile.yes") || "Yes" : t("profile.no") || "No"}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("profile.wishlistCount") || "Wishlist Items"}
              </label>
              <input
                type="text"
                value={userProfile?.wishlist?.length ?? 0}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div>
          {purchaseHistory.length === 0 && !isLoadingPurchases ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="mb-4 text-gray-600">{t("profile.noPurchases") || "No purchases yet"}</p>
              <button
                onClick={handleLoadPurchases}
                className="rounded-lg bg-golden px-4 py-2 text-white transition hover:bg-golden/90"
              >
                {t("profile.loadPurchases") || "Load Purchases"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchaseHistory.map((item) => (
                <div key={item.id} className="rounded-lg border p-4 transition hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-golden">
                        {item.price} {item.currency}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistProducts.length ? (
            <ul className="grid gap-3">
              {wishlistProducts.map((product) => (
                <li
                  key={product.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row"
                >
                  <div className="h-28 w-full overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                    <Image
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.name}
                      width={180}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.shortDescription}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-golden">{formatPrice(product.price)}</p>
                        {product.compareAtPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
            <div className="py-12 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-600">{t("profile.noWishlist") || "No wishlist items yet."}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("settings.language") || "Language"}
            </label>
            <div className="flex gap-2">
              {["en", "ar"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as "en" | "ar")}
                  className={`rounded-lg px-4 py-2 font-medium transition ${
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("settings.currency") || "Currency"}
            </label>
            <select
              onChange={(e) => handleCurrencyChange(e.target.value)}
              value={currency.code}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-golden focus:outline-none"
            >
              {supportedCurrencies.map((currencyConfig) => (
                <option key={currencyConfig.code} value={currencyConfig.code}>
                  {currencyConfig.code} - {currencyConfig.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
}
