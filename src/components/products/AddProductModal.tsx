import React, { useState } from "react";
import { Product, ProductCategory, WarrantyProvider, WarrantyType } from "../../types";
import { PRODUCT_CATEGORIES, WARRANTY_PROVIDERS, WARRANTY_TYPES } from "../../core/constants";
import { calculateReturnEndDate, calculateWarrantyEndDate } from "../../core/date-utils";
import { X, Plus, Sparkles, AlertCircle, Scan } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onSwitchToScan: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  onSwitchToScan,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Electronics");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [merchant, setMerchant] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [returnPeriodDays, setReturnPeriodDays] = useState<string>("7");
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState<string>("12");
  const [warrantyProvider, setWarrantyProvider] = useState<WarrantyProvider>("Manufacturer");
  const [warrantyType, setWarrantyType] = useState<WarrantyType>("Manufacturer warranty");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const price = parseFloat(purchasePrice);
    if (!name.trim()) {
      setErrorMessage("Please enter a product name.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setErrorMessage("Please enter a valid purchase price.");
      return;
    }
    if (!purchaseDate) {
      setErrorMessage("Please specify the purchase date.");
      return;
    }

    const returnDays = parseInt(returnPeriodDays) || 7;
    const warrantyMonths = parseInt(warrantyDurationMonths) || 12;

    const returnEndDate = calculateReturnEndDate(purchaseDate, returnDays);
    const warrantyEndDate = calculateWarrantyEndDate(purchaseDate, warrantyMonths);

    onSaveProduct({
      ownerId: "user-1",
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      category,
      purchasePrice: price,
      currency: "INR",
      purchaseDate,
      merchant: merchant.trim() || "Retail Store",
      invoiceNumber: invoiceNumber.trim() || undefined,
      orderId: orderId.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      returnPeriodDays: returnDays,
      returnEndDate,
      warrantyDurationMonths: warrantyMonths,
      warrantyStartDate: purchaseDate,
      warrantyEndDate,
      warrantyProvider,
      warrantyType,
      hasReceipt: Boolean(invoiceNumber.trim()),
      status: "Active",
      serviceRecords: [],
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Product Manually</h2>
              <p className="text-[11px] text-slate-500 font-medium">Record item and warranty details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scan Promo bar */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Have a physical bill or PDF?</span>
          </div>
          <button
            type="button"
            onClick={onSwitchToScan}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
          >
            <Scan className="w-3 h-3" />
            <span>Scan Receipt</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Basic info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Product Overview
            </h3>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sony WH-CH720N Wireless Headphones"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Model Number</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. WH-CH720N"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Purchase Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="e.g. 8999"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Purchase & Merchant details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Purchase & Invoice Information
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Seller / Store</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Amazon, Croma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Invoice / Bill #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-29381"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 402-99120"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Serial Number (Essential for warranty claims)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN894029184"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section: Return & Warranty terms */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Warranty & Return Terms
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Return Window (Days)</label>
                <input
                  type="number"
                  value={returnPeriodDays}
                  onChange={(e) => setReturnPeriodDays(e.target.value)}
                  placeholder="7"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Warranty (Months)</label>
                <input
                  type="number"
                  value={warrantyDurationMonths}
                  onChange={(e) => setWarrantyDurationMonths(e.target.value)}
                  placeholder="12"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Warranty Provider</label>
                <select
                  value={warrantyProvider}
                  onChange={(e) => setWarrantyProvider(e.target.value as WarrantyProvider)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {WARRANTY_PROVIDERS.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Warranty Type</label>
                <select
                  value={warrantyType}
                  onChange={(e) => setWarrantyType(e.target.value as WarrantyType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {WARRANTY_TYPES.map((wt) => (
                    <option key={wt} value={wt}>
                      {wt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Notes / Coverage Details</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Covers manufacturing defects. Physical and liquid damage excluded."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              Save Product to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
