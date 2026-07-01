"use client";

import { logEvent } from "firebase/analytics";
import { get, push, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { analytics, auth, db } from "@/lib/firebase";

const ANALYTICS_STORAGE_KEY = "marbella-admin-events";
let hasInitializedAuthListener = false;

export type AnalyticsEventName =
  "page_view" | "view_item" | "add_to_cart" | "begin_checkout" | "purchase" | "search" | "login";

interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

interface AnalyticsEventRecord {
  eventName: AnalyticsEventName;
  payload: AnalyticsPayload;
  timestamp: string;
  userId?: string | null;
}

export interface AdminAnalyticsSnapshot {
  revenue: number;
  orders: number;
  visitors: number;
  cartAdds: number;
  searches: number;
  conversionRate: number;
  avgOrderValue: number;
}

export interface AdminPurchaseOrder {
  id: string;
  total: number;
  currency: string;
  status: string;
  timestamp: string;
}

interface AnalyticsOrderRecord {
  total?: number | string;
  currency?: string;
  status?: string;
  timestamp?: string;
}

export interface AdminAnalyticsData {
  snapshot: AdminAnalyticsSnapshot;
  purchaseOrders: AdminPurchaseOrder[];
}

export const EMPTY_ADMIN_ANALYTICS_SNAPSHOT: AdminAnalyticsSnapshot = {
  revenue: 0,
  orders: 0,
  visitors: 0,
  cartAdds: 0,
  searches: 0,
  conversionRate: 0,
  avgOrderValue: 0,
};

function isAnalyticsReady() {
  return !!analytics;
}

function readStoredEvents(): AnalyticsEventRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredEvents(events: AnalyticsEventRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(-100)));
  } catch {
    // Ignore storage write failures in restricted browsers
  }
}

async function flushStoredEventsToFirebase() {
  if (typeof window === "undefined") return;
  if (!auth.currentUser) return;

  const storedEvents = readStoredEvents();
  if (storedEvents.length === 0) return;

  for (const eventRecord of storedEvents) {
    try {
      await persistAnalyticsEventToFirebase(eventRecord);
    } catch (error) {
      console.warn("Failed to flush stored analytics event to Firebase", error);
      return;
    }
  }

  writeStoredEvents([]);
}

function ensureAnalyticsAuthListener() {
  if (typeof window === "undefined" || hasInitializedAuthListener) return;

  hasInitializedAuthListener = true;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      void flushStoredEventsToFirebase();
    }
  });
}

function persistAnalyticsEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  ensureAnalyticsAuthListener();

  const eventRecord: AnalyticsEventRecord = {
    eventName,
    payload,
    timestamp: new Date().toISOString(),
    userId: auth.currentUser?.uid ?? null,
  };

  const previous = readStoredEvents();
  writeStoredEvents([...previous, eventRecord]);

  if (auth.currentUser) {
    persistAnalyticsEventToFirebase(eventRecord).catch((error) => {
      console.warn("Firebase analytics DB write failed", error);
    });
  } else {
    console.warn("Skipping Firebase analytics write until authentication is available.");
  }
}

async function persistAnalyticsEventToFirebase(eventRecord: AnalyticsEventRecord) {
  if (!auth.currentUser) {
    throw new Error("Firebase analytics DB write skipped because the user is not authenticated.");
  }

  await push(ref(db, "analytics/events"), eventRecord);
}

export function trackAnalyticsEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  persistAnalyticsEvent(eventName, payload);

  if (!isAnalyticsReady()) return;

  const analyticsInstance = analytics;
  if (!analyticsInstance) return;

  try {
    logEvent(analyticsInstance, eventName as string, payload);
  } catch (error) {
    console.warn("Analytics event failed", error);
  }
}

export function trackPageView(path?: string) {
  trackAnalyticsEvent("page_view", {
    page_path: path ?? window.location.pathname,
    page_title: document.title,
  });
}

export function trackProductView(
  product: { id?: string; name?: string; price?: number; category?: string } | null | undefined
) {
  if (!product) return;

  trackAnalyticsEvent("view_item", {
    item_id: product.id ?? "unknown",
    item_name: product.name ?? "unknown",
    value: product.price ?? 0,
    item_category: product.category ?? "uncategorized",
  });
}

export function trackAddToCart(
  product: { id?: string; name?: string; price?: number; category?: string } | null | undefined,
  quantity = 1
) {
  if (!product) return;

  trackAnalyticsEvent("add_to_cart", {
    item_id: product.id ?? "unknown",
    item_name: product.name ?? "unknown",
    value: (product.price ?? 0) * quantity,
    quantity,
    item_category: product.category ?? "uncategorized",
  });
}

export function trackBeginCheckout(value = 0, currency = "USD") {
  trackAnalyticsEvent("begin_checkout", {
    value,
    currency,
  });
}

export function trackPurchase(order: { id?: string; total?: number; currency?: string }) {
  trackAnalyticsEvent("purchase", {
    transaction_id: order.id ?? "unknown",
    value: order.total ?? 0,
    currency: order.currency ?? "USD",
  });
}

export function trackSearch(query: string) {
  trackAnalyticsEvent("search", {
    search_term: query,
  });
}

export function trackLogin(method = "unknown") {
  trackAnalyticsEvent("login", {
    method,
  });
}

export function getStoredAnalyticsEvents() {
  return readStoredEvents();
}

function buildAnalyticsSnapshot(events: AnalyticsEventRecord[]): AdminAnalyticsSnapshot {
  const purchaseEvents = events.filter((event) => event.eventName === "purchase");
  const cartEvents = events.filter((event) => event.eventName === "add_to_cart");
  const viewEvents = events.filter((event) => event.eventName === "page_view");
  const searchEvents = events.filter((event) => event.eventName === "search");
  const revenue = purchaseEvents.reduce(
    (total, event) => total + Number(event.payload.value ?? 0),
    0
  );
  const conversions = purchaseEvents.length;
  const conversionRate = cartEvents.length > 0 ? (conversions / cartEvents.length) * 100 : 0;
  const avgOrderValue = conversions > 0 ? revenue / conversions : 0;

  return {
    revenue,
    orders: conversions,
    visitors: viewEvents.length,
    cartAdds: cartEvents.length,
    searches: searchEvents.length,
    conversionRate,
    avgOrderValue,
  };
}

export async function fetchAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  if (typeof window === "undefined") {
    return {
      snapshot: EMPTY_ADMIN_ANALYTICS_SNAPSHOT,
      purchaseOrders: [],
    };
  }

  try {
    const [analyticsSnapshot, ordersSnapshot] = await Promise.all([
      get(ref(db, "analytics/events")),
      get(ref(db, "analytics/orders")),
    ]);

    const analyticsEvents = analyticsSnapshot.exists()
      ? Object.values(analyticsSnapshot.val() as Record<string, AnalyticsEventRecord>)
      : [];

    const snapshot = buildAnalyticsSnapshot(analyticsEvents);
    const purchaseOrders: AdminPurchaseOrder[] = ordersSnapshot.exists()
      ? Object.entries(ordersSnapshot.val() as Record<string, AnalyticsOrderRecord>).map(
          ([key, value]) => ({
            id: key,
            total: Number(value.total ?? 0),
            currency: value.currency ?? "BHD",
            status: value.status ?? "unknown",
            timestamp: value.timestamp ?? "",
          })
        )
      : [];

    return {
      snapshot,
      purchaseOrders,
    };
  } catch (error) {
    console.warn("Failed to fetch admin analytics data from Firebase", error);
    return {
      snapshot: EMPTY_ADMIN_ANALYTICS_SNAPSHOT,
      purchaseOrders: [],
    };
  }
}

export function getAdminAnalyticsSnapshot() {
  const events = readStoredEvents();
  return buildAnalyticsSnapshot(events);
}

export function getAdminRevenueSeriesFromSnapshot(snapshot: AdminAnalyticsSnapshot) {
  const baseline = snapshot.revenue / 7;

  return [
    { name: "Mon", revenue: Math.round(baseline * 0.9) },
    { name: "Tue", revenue: Math.round(baseline * 1.1) },
    { name: "Wed", revenue: Math.round(baseline * 1.25) },
    { name: "Thu", revenue: Math.round(baseline * 1.15) },
    { name: "Fri", revenue: Math.round(baseline * 1.4) },
    { name: "Sat", revenue: Math.round(baseline * 1.6) },
    { name: "Sun", revenue: Math.round(baseline * 1.75) },
  ];
}

export function getAdminChannelBreakdown() {
  return [
    { name: "Direct", share: 42, color: "#e28812" },
    { name: "Organic", share: 28, color: "#f19100" },
    { name: "Social", share: 18, color: "#0f1a2e" },
    { name: "Email", share: 12, color: "#5bb8f5" },
  ];
}
