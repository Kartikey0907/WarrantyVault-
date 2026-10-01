import React, { useState } from "react";
import { Product } from "../../types";
import { formatCurrency, formatDate, getWarrantyStatus, getReturnStatus } from "../../core/date-utils";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Receipt, 
  Wrench, 
  FileText, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Plus, 
  AlertCircle 
} from "lucide-react";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onOpenWarrantyClaim: (product: Product) => void;
  onOpenAddService: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onEdit,
  onDelete,
  onOpenWarrantyClaim,
  onOpenAddService,
}) => {
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const warrantyStatus = getWarrantyStatus(
    product.warrantyEndDate,
    product.isLifetimeWarranty,
    product.warrantyType
  );
  const returnStatus = getReturnStatus(product.returnEndDate, product.isNotReturnable);

  const handleCopySerial = () => {
    if (product.serialNumber) {
      navigator.clipboard.writeText(product.serialNumber);
      setCopiedSerial(true);
      setTimeout(() => setCopiedSerial(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-14 space-y-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Edit product"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {product.category} · {product.brand || "Brand"}
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>
            {product.model && (
              <p className="text-xs text-slate-500 font-medium">Model: {product.model}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-slate-900">
              {formatCurrency(product.purchasePrice, product.currency)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Purchased: {formatDate(product.purchaseDate)}
            </div>
          </div>
        </div>

        {/* Primary Countdowns Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
          {/* Warranty Countdown Card */}
          <div
            className={`p-3 rounded-2xl border ${warrantyStatus.badgeBg} ${warrantyStatus.badgeBorder} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Warranty
              </span>
              <ShieldCheck className={`w-3.5 h-3.5 ${warrantyStatus.badgeText}`} />
            </div>
            <div className={`text-sm font-bold ${warrantyStatus.badgeText}`}>
              {warrantyStatus.label}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Valid until: {formatDate(product.warrantyEndDate)}
            </div>
          </div>

          {/* Return Countdown Card */}
          <div
            className={`p-3 rounded-2xl border ${returnStatus.badgeBg} ${returnStatus.badgeBorder} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Return Period
              </span>
              <Clock className={`w-3.5 h-3.5 ${returnStatus.badgeText}`} />
            </div>
            <div className={`text-sm font-bold ${returnStatus.badgeText}`}>
              {returnStatus.label}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Ends: {formatDate(product.returnEndDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onOpenWarrantyClaim(product)}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Warranty Claim</span>
        </button>

        <button
          onClick={() => setShowReceiptModal(true)}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs active:scale-98 transition-all shadow-sm"
        >
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>View Receipt</span>
        </button>
      </div>

      {/* Ownership & Device Specs */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Ownership & Registration Record
        </h2>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Merchant / Seller</span>
            <span className="font-semibold text-slate-900">{product.merchant || "Not recorded"}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Invoice / Bill #</span>
            <span className="font-mono text-slate-900 font-medium">{product.invoiceNumber || "Not recorded"}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Order ID</span>
            <span className="font-mono text-slate-900 font-medium">{product.orderId || "Not recorded"}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Warranty Type</span>
            <span className="text-slate-900 font-medium">{product.warrantyType || "Standard Manufacturer"}</span>
          </div>

          {/* Serial Number with Copy Button */}
          <div className="col-span-2 pt-1">
            <span className="text-slate-500 block text-[11px]">Serial Number</span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
              <span className="font-mono text-emerald-700 font-bold text-xs">
                {product.serialNumber || "No serial number recorded"}
              </span>
              {product.serialNumber && (
                <button
                  onClick={handleCopySerial}
                  className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-lg bg-white border border-slate-200 shadow-sm"
                >
                  {copiedSerial ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {product.notes && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-500 block text-[11px] mb-0.5">Notes</span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{product.notes}</p>
          </div>
        )}
      </div>

      {/* Service History Timeline */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Service History ({product.serviceRecords?.length || 0})
            </h2>
          </div>
          <button
            onClick={() => onOpenAddService(product)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>

        {product.serviceRecords && product.serviceRecords.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {product.serviceRecords.map((record, idx) => (
              <div
                key={record.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Service #{product.serviceRecords.length - idx}
                  </span>
                  <span className="text-slate-500 font-medium">{formatDate(record.serviceDate)}</span>
                </div>
                <div className="text-xs text-emerald-700 font-bold">
                  {record.serviceCenter}
                </div>
                <div className="text-xs text-slate-700">
                  <span className="text-slate-500">Issue:</span> {record.problem}
                </div>
                {record.repairPerformed && (
                  <div className="text-xs text-slate-700">
                    <span className="text-slate-500">Repair:</span> {record.repairPerformed}
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 text-slate-600">
                  <span className="font-semibold">Cost: {formatCurrency(record.cost, record.currency)}</span>
                  {record.warrantyClaimUsed && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                      Warranty Claim Used
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-1">
            <p className="text-xs text-slate-600 font-medium">No service records yet.</p>
            <p className="text-[11px] text-slate-400">
              Keep a log of repairs, part replacements, or battery maintenance.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete this product?</h3>
              <p className="text-xs text-slate-500">
                This will permanently delete {product.name} and all associated service records from your vault.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(product.id);
                  onBack();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Proof of Purchase</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-2">
              <div className="text-center font-bold text-emerald-800 text-xs pb-2 border-b border-slate-200">
                TAX INVOICE & OWNERSHIP RECEIPT
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant:</span>
                <span className="font-semibold text-slate-900">{product.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="text-slate-900">{product.invoiceNumber || "INV-29381"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-900">{product.purchaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serial No:</span>
                <span className="text-slate-900">{product.serialNumber || "N/A"}</span>
              </div>
              <div className="py-2 border-t border-b border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>{product.name}</span>
                  <span>{formatCurrency(product.purchasePrice, product.currency)}</span>
                </div>
                <div className="text-[10px] text-slate-500">Model: {product.model || "Standard"}</div>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-700 pt-1">
                <span>TOTAL PAID</span>
                <span>{formatCurrency(product.purchasePrice, product.currency)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              Stored digitally in WarrantyVault encrypted cloud storage.
            </p>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
