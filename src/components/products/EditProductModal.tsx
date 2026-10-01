import React, { useState } from "react";
import { Product, ProductCategory, WarrantyProvider, WarrantyType, ProductStatus } from "../../types";
import { PRODUCT_CATEGORIES, WARRANTY_PROVIDERS, WARRANTY_TYPES } from "../../core/constants";
import { X, Edit3, AlertCircle } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand || "");
  const [model, setModel] = useState(product.model || "");
  const [category, setCategory] = useState<ProductCategory>(product.category);
  const [purchasePrice, setPurchasePrice] = useState(String(product.purchasePrice));
  const [purchaseDate, setPurchaseDate] = useState(product.purchaseDate);
  const [merchant, setMerchant] = useState(product.merchant || "");
  const [invoiceNumber, setInvoiceNumber] = useState(product.invoiceNumber || "");
  const [orderId, setOrderId] = useState(product.orderId || "");
  const [serialNumber, setSerialNumber] = useState(product.serialNumber || "");
  const [returnEndDate, setReturnEndDate] = useState(product.returnEndDate || "");
  const [warrantyEndDate, setWarrantyEndDate] = useState(product.warrantyEndDate || "");
  const [warrantyProvider, setWarrantyProvider] = useState<WarrantyProvider>(
    product.warrantyProvider || "Manufacturer"
  );
  const [warrantyType, setWarrantyType] = useState<WarrantyType>(
    product.warrantyType || "Manufacturer warranty"
  );
  const [status, setStatus] = useState<ProductStatus>(product.status || "Active");
  const [notes, setNotes] = useState(product.notes || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }

    onSave({
      ...product,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      category,
      purchasePrice: parseFloat(purchasePrice) || 0,
      purchaseDate,
      merchant: merchant.trim(),
      invoiceNumber: invoiceNumber.trim() || undefined,
      orderId: orderId.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      returnEndDate: returnEndDate || undefined,
      warrantyEndDate: warrantyEndDate || undefined,
      warrantyProvider,
      warrantyType,
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Edit Product</h2>
              <p className="text-[11px] text-slate-500 font-medium">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Return End Date</label>
              <input
                type="date"
                value={returnEndDate}
                onChange={(e) => setReturnEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Warranty End Date</label>
              <input
                type="date"
                value={warrantyEndDate}
                onChange={(e) => setWarrantyEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};
