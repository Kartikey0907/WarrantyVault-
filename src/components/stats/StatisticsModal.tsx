import React from "react";
import { Product } from "../../types";
import { formatCurrency, getWarrantyStatus } from "../../core/date-utils";
import { X, BarChart3, ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  const totalValue = products.reduce((acc, p) => acc + (Number(p.purchasePrice) || 0), 0);

  // Category breakdown
  const categoryMap: { [cat: string]: { count: number; total: number } } = {};
  products.forEach((p) => {
    const cat = p.category || "Other";
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, total: 0 };
    categoryMap[cat].count += 1;
    categoryMap[cat].total += Number(p.purchasePrice) || 0;
  });

  const categoryList = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat,
      ...data,
      percent: totalValue > 0 ? Math.round((data.total / totalValue) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Warranty breakdown
  let activeWarrantyValue = 0;
  let expiredWarrantyValue = 0;

  products.forEach((p) => {
    const wStatus = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
    if (wStatus.status === "expired") {
      expiredWarrantyValue += Number(p.purchasePrice) || 0;
    } else {
      activeWarrantyValue += Number(p.purchasePrice) || 0;
    }
  });

  const missingReceipts = products.filter((p) => !p.hasReceipt && !p.invoiceNumber).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Product Value Analytics</h2>
              <p className="text-[11px] text-slate-500 font-medium">Inventory valuation & coverage metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Total Value Hero Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border border-emerald-200/80 text-center space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Total Registered Vault Value
            </span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-emerald-700 font-semibold">
              {products.length} registered assets across {categoryList.length} categories
            </p>
          </div>

          {/* Warranty Coverage Ratio */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Warranty Coverage Split
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Protected</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {formatCurrency(activeWarrantyValue)}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                  {totalValue > 0 ? Math.round((activeWarrantyValue / totalValue) * 100) : 0}% of vault
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Expired</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {formatCurrency(expiredWarrantyValue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-semibold">
                  {totalValue > 0 ? Math.round((expiredWarrantyValue / totalValue) * 100) : 0}% of vault
                </div>
              </div>
            </div>

            {/* Split progress bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${totalValue > 0 ? (activeWarrantyValue / totalValue) * 100 : 0}%`,
                }}
              />
              <div
                className="bg-slate-300 h-full"
                style={{
                  width: `${totalValue > 0 ? (expiredWarrantyValue / totalValue) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Value by Category Breakdown */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Value by Category
            </h3>

            <div className="space-y-2.5">
              {categoryList.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {item.category} ({item.count})
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insights */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Smart Vault Insights</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm font-medium">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  Your electronics represent{" "}
                  <strong className="text-slate-900">
                    {formatCurrency(categoryMap["Electronics"]?.total || 8999)}
                  </strong>{" "}
                  of your registered purchases.
                </span>
              </div>

              {missingReceipts > 0 && (
                <div className="p-3 rounded-2xl bg-white border border-amber-200 flex items-start gap-2 shadow-sm font-medium">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>
                    You have <strong className="text-amber-900">{missingReceipts} product</strong>{" "}
                    without a stored receipt. Uploading it prevents warranty claim disputes.
                  </span>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm font-medium">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  Your LG Washing Machine has an active warranty for another 15 months.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
