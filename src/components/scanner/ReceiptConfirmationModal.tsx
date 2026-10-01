import React, { useState } from "react";
import { OCRScanResult, ExtractedProductItem, Product, ProductCategory } from "../../types";
import { PRODUCT_CATEGORIES } from "../../core/constants";
import { formatCurrency, calculateReturnEndDate, calculateWarrantyEndDate } from "../../core/date-utils";
import { 
  CheckCircle2, 
  Layers, 
  X, 
  Edit3 
} from "lucide-react";

interface ReceiptConfirmationModalProps {
  isOpen: boolean;
  scanResult: OCRScanResult;
  onClose: () => void;
  onSaveProducts: (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => void;
}

export const ReceiptConfirmationModal: React.FC<ReceiptConfirmationModalProps> = ({
  isOpen,
  scanResult,
  onClose,
  onSaveProducts,
}) => {
  if (!isOpen) return null;

  const [items, setItems] = useState<ExtractedProductItem[]>(
    scanResult.products.map((p) => ({ ...p, selected: true }))
  );
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [merchant, setMerchant] = useState<string>(scanResult.merchant || "Retail Store");
  const [invoiceNumber, setInvoiceNumber] = useState<string>(scanResult.invoiceNumber || "");
  const [purchaseDate, setPurchaseDate] = useState<string>(
    scanResult.purchaseDate || new Date().toISOString().split("T")[0]
  );
  const [orderId, setOrderId] = useState<string>(scanResult.orderId || "");

  const activeItem = items[activeItemIndex] || items[0];

  const handleUpdateActiveItem = (field: keyof ExtractedProductItem, value: any) => {
    const updated = [...items];
    updated[activeItemIndex] = {
      ...updated[activeItemIndex],
      [field]: value,
    };
    setItems(updated);
  };

  const toggleSelect = (index: number) => {
    const updated = [...items];
    updated[index].selected = !updated[index].selected;
    setItems(updated);
  };

  const handleSelectAll = (selectAll: boolean) => {
    setItems(items.map((i) => ({ ...i, selected: selectAll })));
  };

  const selectedCount = items.filter((i) => i.selected).length;

  const handleConfirmSave = () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) return;

    const productsToSave: Omit<Product, "id" | "createdAt" | "updatedAt">[] = selectedItems.map((item) => {
      const returnPeriod = item.returnPeriodDays || 7;
      const warrantyDuration = item.warrantyDurationMonths || 12;

      const returnEnd = calculateReturnEndDate(purchaseDate, returnPeriod);
      const warrantyEnd = calculateWarrantyEndDate(purchaseDate, warrantyDuration);

      return {
        ownerId: "user-1",
        name: item.productName || "Product",
        brand: item.brand || "",
        model: item.model || "",
        category: item.category || "Electronics",
        purchasePrice: Number(item.purchasePrice) || 0,
        currency: item.currency || "INR",
        purchaseDate,
        merchant,
        invoiceNumber,
        orderId,
        serialNumber: item.serialNumber || undefined,
        returnPeriodDays: returnPeriod,
        returnEndDate: returnEnd,
        warrantyDurationMonths: warrantyDuration,
        warrantyStartDate: purchaseDate,
        warrantyEndDate: warrantyEnd,
        warrantyProvider: "Manufacturer",
        warrantyType: "Manufacturer warranty",
        hasReceipt: true,
        receiptFileName: `${merchant.replace(/\s+/g, "_")}_Invoice.pdf`,
        status: "Active",
        serviceRecords: [],
        notes: item.notes || undefined,
      };
    });

    onSaveProducts(productsToSave);
  };

  const confidencePercent = Math.round((scanResult.confidence || 0.92) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Review Extracted Data</h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span>Confidence:</span>
                <span className="font-bold text-emerald-700">{confidencePercent}%</span>
                <span>·</span>
                <span>{items.length} item{items.length > 1 ? "s" : ""} detected</span>
              </div>
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
          {/* Multi-Item Selector if more than 1 item */}
          {items.length > 1 && (
            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{items.length} Products Detected on Bill</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={() => handleSelectAll(true)}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-500 font-medium hover:underline"
                  >
                    Deselect
                  </button>
                </div>
              </div>

              {/* Items chips list */}
              <div className="space-y-1.5">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                      activeItemIndex === idx
                        ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                        : "bg-white/80 border-slate-200 hover:bg-white"
                    }`}
                    onClick={() => setActiveItemIndex(idx)}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <input
                        type="checkbox"
                        checked={it.selected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(idx);
                        }}
                        className="w-4 h-4 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-800 truncate">
                        {it.productName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(it.purchasePrice)}
                      </span>
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bill / Invoice Level Information */}
          <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Bill / Invoice Metadata
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">Merchant / Store</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-29381"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. OD402910"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Active Product Details Editor */}
          {activeItem && (
            <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Product Details ({activeItemIndex + 1} of {items.length})
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Edit fields before saving
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={activeItem.productName}
                    onChange={(e) => handleUpdateActiveItem("productName", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Brand</label>
                    <input
                      type="text"
                      value={activeItem.brand || ""}
                      onChange={(e) => handleUpdateActiveItem("brand", e.target.value)}
                      placeholder="e.g. Sony, Dell"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Model</label>
                    <input
                      type="text"
                      value={activeItem.model || ""}
                      onChange={(e) => handleUpdateActiveItem("model", e.target.value)}
                      placeholder="e.g. WH-CH720N"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Purchase Price (₹)</label>
                    <input
                      type="number"
                      value={activeItem.purchasePrice}
                      onChange={(e) => handleUpdateActiveItem("purchasePrice", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Category</label>
                    <select
                      value={activeItem.category}
                      onChange={(e) => handleUpdateActiveItem("category", e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Return Window (Days)</label>
                    <input
                      type="number"
                      value={activeItem.returnPeriodDays ?? 7}
                      onChange={(e) => handleUpdateActiveItem("returnPeriodDays", parseInt(e.target.value) || 0)}
                      placeholder="7"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Warranty (Months)</label>
                    <input
                      type="number"
                      value={activeItem.warrantyDurationMonths ?? 12}
                      onChange={(e) => handleUpdateActiveItem("warrantyDurationMonths", parseInt(e.target.value) || 0)}
                      placeholder="12"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">Serial Number (Optional)</label>
                  <input
                    type="text"
                    value={activeItem.serialNumber || ""}
                    onChange={(e) => handleUpdateActiveItem("serialNumber", e.target.value)}
                    placeholder="Found on barcode sticker or box"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-900">{selectedCount}</span> of {items.length} items will be vaulted
          </div>
          <button
            onClick={handleConfirmSave}
            disabled={selectedCount === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            Confirm & Save to Vault
          </button>
        </div>
      </div>
    </div>
  );
};
