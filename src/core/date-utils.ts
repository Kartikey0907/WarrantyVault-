/**
 * WarrantyVault Date & Financial Math Engine
 * Handles Indian Rupee formatting, leap years, month length differences,
 * return deadline countdowns, warranty countdowns, and WCAG-compliant status badges.
 */

export function formatCurrency(amount: number, currency: string = "INR"): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  
  if (currency === "INR") {
    // Format according to Indian Numbering System: 1,48,500
    const rounded = Math.round(amount);
    return `₹${rounded.toLocaleString("en-IN")}`;
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Not recorded";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString || "Invalid date";
  }
}

/**
 * Adds months to a date safely handling month length differences and leap years
 */
export function addMonthsSafe(startDate: Date, months: number): Date {
  const result = new Date(startDate.getTime());
  const expectedMonth = result.getMonth() + months;
  result.setMonth(expectedMonth);
  // If the month overflowed due to day mismatch (e.g. Aug 31 -> Sept 30)
  if (result.getMonth() > expectedMonth % 12) {
    result.setDate(0); // Roll back to last day of target month
  }
  return result;
}

export function calculateWarrantyEndDate(
  purchaseDateStr: string,
  durationMonths: number = 12
): string {
  try {
    const purchaseDate = new Date(purchaseDateStr);
    if (isNaN(purchaseDate.getTime())) return "";
    const endDate = addMonthsSafe(purchaseDate, durationMonths);
    return endDate.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export function calculateReturnEndDate(
  purchaseDateStr: string,
  returnPeriodDays: number = 7
): string {
  try {
    const purchaseDate = new Date(purchaseDateStr);
    if (isNaN(purchaseDate.getTime())) return "";
    const endDate = new Date(purchaseDate.getTime());
    endDate.setDate(endDate.getDate() + returnPeriodDays);
    return endDate.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export interface WarrantyStatusInfo {
  status: "active" | "expiring_soon" | "critical" | "expired" | "lifetime" | "unknown";
  daysRemaining: number;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
}

export function getWarrantyStatus(
  warrantyEndDateStr?: string | null,
  isLifetime: boolean = false,
  warrantyType?: string
): WarrantyStatusInfo {
  if (warrantyType === "No warranty") {
    return {
      status: "unknown",
      daysRemaining: 0,
      label: "No warranty",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-600",
      dotColor: "bg-slate-400",
    };
  }

  if (isLifetime) {
    return {
      status: "lifetime",
      daysRemaining: 99999,
      label: "Lifetime Warranty",
      badgeBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200/80",
      badgeText: "text-emerald-700",
      dotColor: "bg-emerald-500",
    };
  }

  if (!warrantyEndDateStr) {
    return {
      status: "unknown",
      daysRemaining: 0,
      label: "Warranty Unknown",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-600",
      dotColor: "bg-slate-400",
    };
  }

  // Today normalized to midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const end = new Date(warrantyEndDateStr);
  const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffTime = endNormalized.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      status: "expired",
      daysRemaining: days,
      label: `Expired ${Math.abs(days)} days ago`,
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-600",
      dotColor: "bg-slate-400",
    };
  } else if (days <= 7) {
    // RED: Less than 7 days
    return {
      status: "critical",
      daysRemaining: days,
      label: days === 0 ? "Expires today!" : `Critical: ${days} day${days === 1 ? "" : "s"} left`,
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-700",
      dotColor: "bg-rose-500",
    };
  } else if (days <= 30) {
    // ORANGE: 7-30 days
    return {
      status: "critical",
      daysRemaining: days,
      label: `Attention: ${days} days left`,
      badgeBg: "bg-amber-50",
      badgeBorder: "border-amber-200",
      badgeText: "text-amber-800",
      dotColor: "bg-amber-500",
    };
  } else if (days <= 90) {
    // YELLOW: 30-90 days
    return {
      status: "expiring_soon",
      daysRemaining: days,
      label: `Expiring soon: ${days} days`,
      badgeBg: "bg-amber-50/70",
      badgeBorder: "border-amber-200/70",
      badgeText: "text-amber-800",
      dotColor: "bg-amber-400",
    };
  } else {
    // GREEN: > 90 days
    return {
      status: "active",
      daysRemaining: days,
      label: `Active: ${days} days remaining`,
      badgeBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200/80",
      badgeText: "text-emerald-700",
      dotColor: "bg-emerald-500",
    };
  }
}

export interface ReturnStatusInfo {
  isReturnable: boolean;
  daysRemaining: number;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export function getReturnStatus(
  returnEndDateStr?: string | null,
  isNotReturnable: boolean = false
): ReturnStatusInfo {
  if (isNotReturnable) {
    return {
      isReturnable: false,
      daysRemaining: 0,
      label: "Not returnable",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-500",
    };
  }

  if (!returnEndDateStr) {
    return {
      isReturnable: false,
      daysRemaining: 0,
      label: "Return window unknown",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-500",
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const end = new Date(returnEndDateStr);
  const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffTime = endNormalized.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      isReturnable: false,
      daysRemaining: days,
      label: "Return period expired",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-200",
      badgeText: "text-slate-500",
    };
  } else if (days === 0) {
    return {
      isReturnable: true,
      daysRemaining: 0,
      label: "Return window closes today!",
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-700",
    };
  } else if (days <= 3) {
    return {
      isReturnable: true,
      daysRemaining: days,
      label: `Return closes in ${days} day${days === 1 ? "" : "s"}!`,
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-700",
    };
  } else {
    return {
      isReturnable: true,
      daysRemaining: days,
      label: `${days} days left to return`,
      badgeBg: "bg-sky-50",
      badgeBorder: "border-sky-200",
      badgeText: "text-sky-700",
    };
  }
}
