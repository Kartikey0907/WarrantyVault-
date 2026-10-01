export type ProductCategory =
  | "Electronics"
  | "Mobile"
  | "Laptop"
  | "TV"
  | "Home Appliances"
  | "Kitchen Appliances"
  | "Furniture"
  | "Vehicles"
  | "Tools"
  | "Gaming"
  | "Camera"
  | "Wearables"
  | "Accessories"
  | "Other";

export type WarrantyProvider =
  | "Manufacturer"
  | "Seller"
  | "Store"
  | "Extended"
  | "Third-party"
  | "Unknown";

export type WarrantyType =
  | "Manufacturer warranty"
  | "Seller warranty"
  | "Extended warranty"
  | "Store warranty"
  | "No warranty"
  | "Unknown";

export type ProductStatus =
  | "Active"
  | "Under repair"
  | "Returned"
  | "Replaced"
  | "Sold"
  | "Lost"
  | "Disposed"
  | "Archived";

export interface ServiceRecord {
  id: string;
  productId: string;
  serviceDate: string; // YYYY-MM-DD
  serviceCenter: string;
  problem: string;
  diagnosis?: string;
  repairPerformed: string;
  cost: number;
  currency: string;
  warrantyClaimUsed: boolean;
  notes?: string;
  attachmentName?: string;
  attachmentDataUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  ownerId: string;
  householdId?: string | null;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  purchasePrice: number;
  currency: string; // Default 'INR'
  purchaseDate: string; // YYYY-MM-DD
  merchant: string; // Seller / Store
  invoiceNumber?: string;
  orderId?: string;
  serialNumber?: string;
  
  // Return Tracking
  returnPeriodDays?: number; // e.g. 7, 10, 14, 30
  returnEndDate?: string; // YYYY-MM-DD
  isNotReturnable?: boolean;
  
  // Warranty Tracking
  warrantyDurationMonths?: number; // e.g. 12, 24
  warrantyStartDate?: string; // YYYY-MM-DD
  warrantyEndDate?: string; // YYYY-MM-DD
  warrantyProvider?: WarrantyProvider;
  warrantyType?: WarrantyType;
  warrantyNotes?: string;
  isLifetimeWarranty?: boolean;
  
  // Document & Media
  receiptUrl?: string;
  receiptDataUrl?: string;
  receiptFileName?: string;
  receiptFileType?: "image/jpeg" | "image/png" | "application/pdf";
  hasReceipt: boolean;
  
  // State
  status: ProductStatus;
  notes?: string;
  tags?: string[];
  
  // Resale readiness (Optional feature)
  itemCondition?: "Brand New" | "Like New" | "Good" | "Fair";
  hasOriginalBox?: boolean;
  hasAccessories?: boolean;
  estimatedResaleValue?: number;
  
  // Service History
  serviceRecords: ServiceRecord[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AlertNotification {
  id: string;
  productId?: string;
  productName?: string;
  type: "return_warning" | "warranty_warning" | "missing_invoice" | "service_due" | "system" | "info";
  urgency: "urgent" | "upcoming" | "info";
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionRoute?: string;
}

export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Viewer";
  avatarColor: string;
  isCurrentUser?: boolean;
}

export interface Household {
  id: string;
  name: string;
  ownerId: string;
  members: HouseholdMember[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  currency: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ExtractedProductItem {
  productName: string;
  brand?: string | null;
  model?: string | null;
  category: ProductCategory;
  purchasePrice: number;
  currency: string;
  serialNumber?: string | null;
  returnPeriodDays?: number | null;
  warrantyDurationMonths?: number | null;
  warrantyProvider?: string;
  warrantyType?: string;
  notes?: string | null;
  selected?: boolean;
}

export interface OCRScanResult {
  merchant: string;
  purchaseDate: string | null;
  invoiceNumber: string | null;
  orderId: string | null;
  totalAmount: number;
  taxAmount: number | null;
  confidence: number;
  detectedProductsCount: number;
  products: ExtractedProductItem[];
  rawText?: string;
  imageDataUrl?: string;
}

export interface UserSettings {
  theme: "system" | "dark" | "light";
  currency: "INR" | "USD" | "EUR" | "GBP";
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  returnRemindersEnabled: boolean;
  returnReminderDays: number[]; // [7, 3, 1]
  warrantyRemindersEnabled: boolean;
  warrantyReminderDays: number[]; // [90, 30, 7, 1]
  biometricLockEnabled: boolean;
  appPin?: string;
  offlineCacheOnly: boolean;
}
