import React, { useState, useMemo } from "react";
import { Product, ProductCategory } from "../../types";
import { PRODUCT_CATEGORIES } from "../../core/constants";
import { formatCurrency, getWarrantyStatus, getReturnStatus } from "../../core/date-utils";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  X, 
  Receipt, 
  Plus, 
  ArrowUpDown,
  Tag,
  Clock
} from "lucide-react";

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
}

type SortOption = "recent" | "price_high" | "warranty_expiry" | "purchase_date";

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
  onOpenAddProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.model.toLowerCase().includes(q) ||
            p.merchant.toLowerCase().includes(q) ||
            (p.serialNumber && p.serialNumber.toLowerCase().includes(q)) ||
            (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q)) ||
            (p.orderId && p.orderId.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        if (selectedStatusFilter === "warranty_active") {
          const status = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
          if (status.status === "expired") return false;
        } else if (selectedStatusFilter === "warranty_expired") {
          const status = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
          if (status.status !== "expired") return false;
        } else if (selectedStatusFilter === "return_active") {
          const rStatus = getReturnStatus(p.returnEndDate, p.isNotReturnable);
          if (!rStatus.isReturnable) return false;
        } else if (selectedStatusFilter === "missing_invoice") {
          if (p.hasReceipt || p.invoiceNumber) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_high") {
          return (Number(b.purchasePrice) || 0) - (Number(a.purchasePrice) || 0);
        } else if (sortBy === "purchase_date") {
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        } else if (sortBy === "warranty_expiry") {
          const endA = a.warrantyEndDate ? new Date(a.warrantyEndDate).getTime() : 0;
          const endB = b.warrantyEndDate ? new Date(b.warrantyEndDate).getTime() : 0;
          return endA - endB;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, selectedStatusFilter, sortBy]);

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-3.5">
      {/* Header and Add button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Vault Products</h1>
          <p className="text-xs text-slate-500">
            {filteredProducts.length} of {products.length} registered items
          </p>
        </div>
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product, brand, serial, invoice..."
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and View Toggle Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Sort selector */}
        <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-sm">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer font-medium"
          >
            <option value="recent">Recently added</option>
            <option value="warranty_expiry">Warranty expiry</option>
            <option value="price_high">Highest price</option>
            <option value="purchase_date">Purchase date</option>
          </select>
        </div>

        {/* View Mode Toggle & Filter Dialog Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all shadow-sm ${
              selectedStatusFilter !== "all" || selectedCategory !== "all"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {(selectedStatusFilter !== "all" || selectedCategory !== "all") && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            title={isGridView ? "Switch to list view" : "Switch to grid view"}
          >
            {isGridView ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Category Pills (horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shadow-sm ${
            selectedCategory === "all"
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
          }`}
        >
          All Categories
        </button>
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shadow-sm ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Modal Drawer if opened */}
      {showFilterModal && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter by Warranty & State
            </span>
            <button
              onClick={() => {
                setSelectedStatusFilter("all");
                setSelectedCategory("all");
              }}
              className="text-[11px] text-emerald-700 font-semibold hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedStatusFilter("all")}
              className={`p-2 rounded-xl text-left border ${
                selectedStatusFilter === "all"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setSelectedStatusFilter("warranty_active")}
              className={`p-2 rounded-xl text-left border ${
                selectedStatusFilter === "warranty_active"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              Active Warranty
            </button>
            <button
              onClick={() => setSelectedStatusFilter("warranty_expired")}
              className={`p-2 rounded-xl text-left border ${
                selectedStatusFilter === "warranty_expired"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              Expired Warranty
            </button>
            <button
              onClick={() => setSelectedStatusFilter("return_active")}
              className={`p-2 rounded-xl text-left border ${
                selectedStatusFilter === "return_active"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              Active Return Window
            </button>
            <button
              onClick={() => setSelectedStatusFilter("missing_invoice")}
              className={`p-2 rounded-xl text-left border col-span-2 ${
                selectedStatusFilter === "missing_invoice"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              Missing Stored Invoice
            </button>
          </div>
        </div>
      )}

      {/* Product List Render */}
      {filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
            <Tag className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {searchQuery || selectedCategory !== "all" || selectedStatusFilter !== "all"
                ? "No matching products found"
                : "Your purchases live here."}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {searchQuery || selectedCategory !== "all" || selectedStatusFilter !== "all"
                ? "Try clearing search filters or checking spelling."
                : "Start by scanning a physical receipt or adding manual details to track return & warranty deadlines."}
            </p>
          </div>
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Add your first product
          </button>
        </div>
      ) : isGridView ? (
        /* Grid View */
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((p) => {
            const wStatus = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
            const rStatus = getReturnStatus(p.returnEndDate, p.isNotReturnable);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="p-3.5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200/80 flex flex-col justify-between cursor-pointer transition-all active:scale-98 shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {p.category}
                    </span>
                    {p.hasReceipt && <Receipt className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-xs font-extrabold text-emerald-700 mt-1">
                    {formatCurrency(p.purchasePrice)}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border text-center ${wStatus.badgeBg} ${wStatus.badgeBorder} ${wStatus.badgeText}`}
                  >
                    {wStatus.label.split(":")[0]}
                  </span>
                  {rStatus.isReturnable && (
                    <span className="text-[9px] text-rose-700 font-semibold text-center">
                      Return: {rStatus.daysRemaining}d
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredProducts.map((p) => {
            const wStatus = getWarrantyStatus(p.warrantyEndDate, p.isLifetimeWarranty, p.warrantyType);
            const rStatus = getReturnStatus(p.returnEndDate, p.isNotReturnable);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer transition-all active:scale-99 shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 group-hover:border-emerald-300 transition-colors">
                    {p.brand ? p.brand.substring(0, 2).toUpperCase() : "WV"}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-800">{formatCurrency(p.purchasePrice)}</span>
                      <span>·</span>
                      <span>{p.merchant}</span>
                    </div>
                    {p.serialNumber && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        SN: {p.serialNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${wStatus.badgeBg} ${wStatus.badgeBorder} ${wStatus.badgeText}`}
                  >
                    {wStatus.label.split(":")[0]}
                  </span>
                  {rStatus.isReturnable ? (
                    <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Return {rStatus.daysRemaining}d</span>
                    </span>
                  ) : p.hasReceipt ? (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <Receipt className="w-3 h-3 text-emerald-600" />
                      <span>Invoice</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-medium">No invoice</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
