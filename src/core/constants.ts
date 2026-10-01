import { ProductCategory, WarrantyProvider, WarrantyType } from "../types";

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string; iconName: string }[] = [
  { id: "Electronics", label: "Electronics", iconName: "Cpu" },
  { id: "Mobile", label: "Mobile", iconName: "Smartphone" },
  { id: "Laptop", label: "Laptop", iconName: "Laptop" },
  { id: "TV", label: "TV & Display", iconName: "Tv" },
  { id: "Home Appliances", label: "Home Appliances", iconName: "Home" },
  { id: "Kitchen Appliances", label: "Kitchen Appliances", iconName: "Coffee" },
  { id: "Furniture", label: "Furniture", iconName: "Armchair" },
  { id: "Vehicles", label: "Vehicles", iconName: "Car" },
  { id: "Tools", label: "Tools & Hardware", iconName: "Wrench" },
  { id: "Gaming", label: "Gaming", iconName: "Gamepad2" },
  { id: "Camera", label: "Camera & Optics", iconName: "Camera" },
  { id: "Wearables", label: "Wearables & Watches", iconName: "Watch" },
  { id: "Accessories", label: "Accessories", iconName: "Headphones" },
  { id: "Other", label: "Other", iconName: "Package" },
];

export const WARRANTY_PROVIDERS: WarrantyProvider[] = [
  "Manufacturer",
  "Seller",
  "Store",
  "Extended",
  "Third-party",
  "Unknown",
];

export const WARRANTY_TYPES: WarrantyType[] = [
  "Manufacturer warranty",
  "Seller warranty",
  "Extended warranty",
  "Store warranty",
  "No warranty",
  "Unknown",
];

export const DEFAULT_USER_SETTINGS = {
  theme: "dark" as const,
  currency: "INR" as const,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  returnRemindersEnabled: true,
  returnReminderDays: [7, 3, 1],
  warrantyRemindersEnabled: true,
  warrantyReminderDays: [90, 30, 7, 1],
  biometricLockEnabled: false,
  offlineCacheOnly: false,
};
