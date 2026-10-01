import React from "react";
import { Home, Package, Bell, User, Scan } from "lucide-react";

export type NavTab = "home" | "products" | "alerts" | "profile";

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertsCount: number;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadAlertsCount,
  onOpenScanner,
}) => {
  return (
    <nav className="relative bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-3 py-2 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {/* Floating Center Action Button for Scan/Add */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onOpenScanner}
          className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-[#F8FAFC] active:scale-95 transition-all group"
          title="Scan Receipt / Add Product"
          aria-label="Scan Receipt or Add Product"
        >
          <Scan className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="flex items-center justify-between max-w-md mx-auto pt-1">
        {/* Home Tab */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            currentTab === "home" ? "text-emerald-700" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === "home" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className="text-[11px] font-semibold tracking-tight">Home</span>
        </button>

        {/* Products Tab */}
        <button
          onClick={() => onTabChange("products")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 mr-4 transition-colors ${
            currentTab === "products" ? "text-emerald-700" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <Package className={`w-5 h-5 ${currentTab === "products" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className="text-[11px] font-semibold tracking-tight">Products</span>
        </button>

        {/* Spacer for Floating Center Button */}
        <div className="w-10" />

        {/* Alerts Tab */}
        <button
          onClick={() => onTabChange("alerts")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 ml-4 transition-colors relative ${
            currentTab === "alerts" ? "text-emerald-700" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${currentTab === "alerts" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight">Alerts</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange("profile")}
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            currentTab === "profile" ? "text-emerald-700" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === "profile" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className="text-[11px] font-semibold tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
