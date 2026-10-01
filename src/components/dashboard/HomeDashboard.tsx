import React from "react";
import { Product, AlertNotification, UserProfile } from "../../types";
import { formatCurrency, formatDate, getWarrantyStatus, getReturnStatus } from "../../core/date-utils";
import { 
  Plus, 
  Scan, 
  Search, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ChevronRight, 
  Receipt, 
  CheckCircle2, 
  ArrowUpRight,
  BarChart3,
  Users
} from "lucide-react";

interface HomeDashboardProps {
  user: UserProfile | null;
  products: Product[];
  alerts: AlertNotification[];
  onSelectProduct: (product: Product) => void;
  onOpenScanner: () => void;
  onOpenAddManual: () => void;
  onOpenSearch: () => void;
  onOpenAIAssistant: () => void;
  onOpenStatistics: () => void;
  onOpenHousehold: () => void;
  onNavigateTab: (tab: "products" | "alerts") => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  products,
  alerts,
  onSelectProduct,
  onOpenScanner,
  onOpenAddManual,
  onOpenSearch,
  onOpenAIAssistant,
  onOpenStatistics,
  onOpenHousehold,
  onNavigateTab,
}) => {
  // Calculate live values
  const totalRegisteredValue = products.reduce((acc, p) => acc + (Number(p.purchasePrice) || 0), 0);
  
  const underWarrantyProducts = products.filter((p) => {
    const status = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
    return status.status === "active" || status.status === "expiring_soon" || status.status === "critical" || status.status === "lifetime";
  });
  
  const totalUnderWarrantyValue = underWarrantyProducts.reduce(
    (acc, p) => acc + (Number(p.purchasePrice) || 0),
    0
  );

  // Attention needed items
  const attentionItems = products
    .map((p) => {
      const returnStatus = getReturnStatus(p.returnEndDate, p.isNotReturnable);
      const warrantyStatus = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);

      if (returnStatus.isReturnable && returnStatus.daysRemaining >= 0 && returnStatus.daysRemaining <= 3) {
        return {
          product: p,
          type: "return" as const,
          days: returnStatus.daysRemaining,
          title: `${p.name} — return expires in ${returnStatus.daysRemaining} days`,
          badge: returnStatus.daysRemaining === 0 ? "Expires Today" : `${returnStatus.daysRemaining} days left`,
          color: "rose",
        };
      }

      if (warrantyStatus.daysRemaining > 0 && warrantyStatus.daysRemaining <= 30) {
        return {
          product: p,
          type: "warranty" as const,
          days: warrantyStatus.daysRemaining,
          title: `${p.name} — warranty expires in ${warrantyStatus.daysRemaining} days`,
          badge: `${warrantyStatus.daysRemaining} days left`,
          color: "amber",
        };
      }

      return null;
    })
    .filter(Boolean) as {
      product: Product;
      type: "return" | "warranty";
      days: number;
      title: string;
      badge: string;
      color: string;
    }[];

  const recentProducts = [...products].slice(0, 4);
  const displayName = user?.name ? user.name.split(" ")[0] : "Friend";

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4">
      {/* Header Profile Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">WarrantyVault</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Hello, {displayName}
          </h1>
          <p className="text-xs text-slate-500">
            {products.length} registered items safely vaulted
          </p>
        </div>
        
        {/* Quick AI & Household shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHousehold}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
            title="Household sharing"
          >
            <Users className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={onOpenAIAssistant}
            className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 transition-all flex items-center gap-1.5 shadow-sm"
            title="Ask AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span className="text-xs font-bold pr-0.5">AI</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards (Registered Value & Under Warranty) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Registered Value */}
        <div 
          onClick={onOpenStatistics}
          className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden cursor-pointer hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Registered Value</span>
            <BarChart3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalRegisteredValue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
            <span className="font-bold text-slate-700">{products.length}</span>
            <span>products total</span>
          </div>
        </div>

        {/* Currently Under Warranty */}
        <div 
          onClick={onOpenStatistics}
          className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/70 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.08)] relative overflow-hidden cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1">
            <span>Under Warranty</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-900 tracking-tight">
            {formatCurrency(totalUnderWarrantyValue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2 font-medium">
            <span className="font-bold">{underWarrantyProducts.length}</span>
            <span>items protected</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 active:scale-98 transition-all"
        >
          <Scan className="w-5 h-5 mb-1.5" />
          <span className="text-xs font-bold">Scan Receipt</span>
        </button>

        <button
          onClick={onOpenAddManual}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm active:scale-98 transition-all"
        >
          <Plus className="w-5 h-5 mb-1.5 text-slate-600" />
          <span className="text-xs font-semibold">Add Manual</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm active:scale-98 transition-all"
        >
          <Search className="w-5 h-5 mb-1.5 text-slate-600" />
          <span className="text-xs font-semibold">Search Vault</span>
        </button>
      </div>

      {/* Attention Needed Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Attention Needed
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab("alerts")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {attentionItems.length > 0 ? (
            attentionItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectProduct(item.product)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-99 shadow-sm ${
                  item.color === "rose"
                    ? "bg-rose-50/70 border-rose-200 hover:border-rose-300"
                    : "bg-amber-50/70 border-amber-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.color === "rose"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {item.type === "return" ? "Return window ending" : "Warranty expiring"} · {item.badge}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                    item.color === "rose"
                      ? "bg-white border-rose-200 text-rose-700"
                      : "bg-white border-amber-200 text-amber-800"
                  }`}
                >
                  {item.badge}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 text-xs text-slate-500 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All return windows & warranties are in good standing!</span>
            </div>
          )}
        </div>
      </div>

      {/* Recently Added Products List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recently Added
          </h2>
          <button
            onClick={() => onNavigateTab("products")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>See all {products.length}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentProducts.map((p) => {
            const wStatus = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
            const rStatus = getReturnStatus(p.returnEndDate, p.isNotReturnable);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer transition-all active:scale-99 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                    {p.brand ? p.brand.substring(0, 2).toUpperCase() : "WV"}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-800">{formatCurrency(p.purchasePrice)}</span>
                      <span>·</span>
                      <span>{p.merchant}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${wStatus.badgeBg} ${wStatus.badgeBorder} ${wStatus.badgeText}`}
                  >
                    {wStatus.label.split(":")[0]}
                  </span>
                  {p.hasReceipt && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <Receipt className="w-3 h-3 text-emerald-600" />
                      <span>Receipt</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
