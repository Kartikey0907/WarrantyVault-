import { Product, AlertNotification, Household, UserSettings, UserProfile, ServiceRecord } from "../types";
import { INITIAL_PRODUCTS, INITIAL_ALERTS, INITIAL_HOUSEHOLD } from "./sample-data";
import { DEFAULT_USER_SETTINGS } from "./constants";

const PRODUCTS_KEY = "wv_products_v1";
const ALERTS_KEY = "wv_alerts_v1";
const HOUSEHOLD_KEY = "wv_household_v1";
const SETTINGS_KEY = "wv_settings_v1";
const USER_KEY = "wv_user_v1";
const HAS_SEEN_ONBOARDING_KEY = "wv_has_seen_onboarding_v1";

export class StorageService {
  static getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Storage error:", e);
    }
    return null;
  }

  static saveUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  static hasSeenOnboarding(): boolean {
    return localStorage.getItem(HAS_SEEN_ONBOARDING_KEY) === "true";
  }

  static setHasSeenOnboarding(seen: boolean): void {
    localStorage.setItem(HAS_SEEN_ONBOARDING_KEY, seen ? "true" : "false");
  }

  static getProducts(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (data) return JSON.parse(data);
      // Initialize with sample products
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  static addProduct(product: Product): Product {
    const products = this.getProducts();
    const updated = [product, ...products];
    this.saveProducts(updated);
    
    // Auto-generate alerts if return or warranty is closing
    this.checkAndGenerateAlertsForProduct(product);
    return product;
  }

  static updateProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
      this.saveProducts(products);
    }
    return product;
  }

  static deleteProduct(productId: string): void {
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.saveProducts(products);
    // Remove alerts for this product
    const alerts = this.getAlerts().filter((a) => a.productId !== productId);
    this.saveAlerts(alerts);
  }

  static addServiceRecord(productId: string, record: Omit<ServiceRecord, "id" | "createdAt">): ServiceRecord {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");

    const newRecord: ServiceRecord = {
      ...record,
      id: "srv-" + Date.now(),
      productId,
      createdAt: new Date().toISOString(),
    };

    if (!product.serviceRecords) product.serviceRecords = [];
    product.serviceRecords.unshift(newRecord);
    this.updateProduct(product);
    return newRecord;
  }

  static getAlerts(): AlertNotification[] {
    try {
      const data = localStorage.getItem(ALERTS_KEY);
      if (data) return JSON.parse(data);
      this.saveAlerts(INITIAL_ALERTS);
      return INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  }

  static saveAlerts(alerts: AlertNotification[]): void {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }

  static markAlertAsRead(alertId: string): void {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.saveAlerts(alerts);
    }
  }

  static markAllAlertsRead(): void {
    const alerts = this.getAlerts().map((a) => ({ ...a, read: true }));
    this.saveAlerts(alerts);
  }

  static getHousehold(): Household {
    try {
      const data = localStorage.getItem(HOUSEHOLD_KEY);
      if (data) return JSON.parse(data);
      this.saveHousehold(INITIAL_HOUSEHOLD);
      return INITIAL_HOUSEHOLD;
    } catch {
      return INITIAL_HOUSEHOLD;
    }
  }

  static saveHousehold(household: Household): void {
    localStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));
  }

  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(data) };
      return DEFAULT_USER_SETTINGS;
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  static checkAndGenerateAlertsForProduct(product: Product): void {
    const alerts = this.getAlerts();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check return window
    if (product.returnEndDate && !product.isNotReturnable) {
      const end = new Date(product.returnEndDate);
      const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 3) {
        alerts.unshift({
          id: `alert-return-${product.id}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          type: "return_warning",
          urgency: "urgent",
          title: `Return window closes in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
          message: `Return period for ${product.name} ends soon.`,
          date: new Date().toISOString().split("T")[0],
          read: false,
        });
      }
    }

    // Check invoice missing
    if (!product.hasReceipt && !product.invoiceNumber) {
      alerts.unshift({
        id: `alert-no-inv-${product.id}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        type: "missing_invoice",
        urgency: "upcoming",
        title: `Missing invoice for ${product.name}`,
        message: "No receipt attached. Upload an invoice to protect your warranty claim.",
        date: new Date().toISOString().split("T")[0],
        read: false,
      });
    }

    this.saveAlerts(alerts);
  }

  static resetToSampleData(): void {
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveAlerts(INITIAL_ALERTS);
    this.saveHousehold(INITIAL_HOUSEHOLD);
  }

  static wipeAllData(): void {
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(ALERTS_KEY);
    localStorage.removeItem(HOUSEHOLD_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HAS_SEEN_ONBOARDING_KEY);
  }
}
