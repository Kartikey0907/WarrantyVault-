import React, { useState } from "react";
import { Product } from "../../types";
import { getWarrantyStatus, formatDate } from "../../core/date-utils";
import { AIService } from "../../services/ai-service";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  Mail, 
  Sparkles, 
  X 
} from "lucide-react";

interface WarrantyClaimModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
}

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
  isOpen,
  product,
  onClose,
  onUpdateProduct,
}) => {
  if (!isOpen) return null;

  const [issueDescription, setIssueDescription] = useState(
    "Device failed during normal operation and will not power on or function properly."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    claimSummary: string;
    emailSubject: string;
    emailBody: string;
  } | null>(null);

  const [missingSerialInput, setMissingSerialInput] = useState("");
  const [isEditingSerial, setIsEditingSerial] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const warrantyStatus = getWarrantyStatus(
    product.warrantyEndDate,
    product.isLifetimeWarranty,
    product.warrantyType
  );

  const hasName = Boolean(product.name?.trim());
  const hasDate = Boolean(product.purchaseDate);
  const hasInvoice = Boolean(product.hasReceipt || product.invoiceNumber);
  const hasSerial = Boolean(product.serialNumber?.trim());
  const hasWarrantyActive = warrantyStatus.status !== "expired";

  const isReady = hasName && hasDate && hasInvoice && hasSerial && hasWarrantyActive;

  const handleSaveMissingSerial = () => {
    if (!missingSerialInput.trim()) return;
    const updated = {
      ...product,
      serialNumber: missingSerialInput.trim(),
    };
    onUpdateProduct(updated);
    setIsEditingSerial(false);
  };

  const handleGenerateClaim = async () => {
    setIsGenerating(true);
    try {
      const result = await AIService.generateWarrantyClaim(product, issueDescription);
      setClaimResult({
        claimSummary: result.claimSummary,
        emailSubject: result.emailSubject,
        emailBody: result.emailBody,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (claimResult) {
      navigator.clipboard.writeText(claimResult.claimSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    if (claimResult) {
      navigator.clipboard.writeText(`Subject: ${claimResult.emailSubject}\n\n${claimResult.emailBody}`);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Warranty Claim Assistant</h2>
              <p className="text-[11px] text-slate-500 font-medium">Readiness check & formal claim packet</p>
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
          {/* Readiness Checklist Card */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Claim Readiness Checklist
              </h3>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  isReady
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                {isReady ? "Ready to Claim" : "Attention Needed"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Product name registered</span>
                {hasName ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <XCircle className="w-4 h-4" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Purchase date ({formatDate(product.purchaseDate)})</span>
                {hasDate ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <XCircle className="w-4 h-4" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Invoice / Proof of Purchase</span>
                {hasInvoice ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attached ({product.invoiceNumber || "Stored"})
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <AlertCircle className="w-4 h-4" /> No invoice attached
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Serial number recorded</span>
                {hasSerial ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {product.serialNumber}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsEditingSerial(true)}
                    className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-bold underline"
                  >
                    <AlertCircle className="w-4 h-4" /> Add Serial Number
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Warranty active status</span>
                {hasWarrantyActive ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active ({warrantyStatus.daysRemaining}d remaining)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <XCircle className="w-4 h-4" /> Expired
                  </span>
                )}
              </div>
            </div>

            {/* Quick Serial Number Entry prompt if missing */}
            {isEditingSerial && !hasSerial && (
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={missingSerialInput}
                  onChange={(e) => setMissingSerialInput(e.target.value)}
                  placeholder="Enter device serial number..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSaveMissingSerial}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Issue Prompt Input */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Describe the Problem or Defect
            </label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Left earcup audio stopped playing; power button unresponsive..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleGenerateClaim}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? "Formatting Claim Packet..." : "Generate Official Claim Summary"}</span>
            </button>
          </div>

          {/* Generated Claim Packet & Email Preview */}
          {claimResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Claim Summary Box */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Structured Claim Summary
                  </span>
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold shadow-sm"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-[11px] text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  {claimResult.claimSummary}
                </pre>
              </div>

              {/* Ready-to-Send Email Draft */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Customer Support Email Draft</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold shadow-sm"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-800 shadow-sm">
                    <span className="text-slate-500 font-sans font-medium">Subject:</span> {claimResult.emailSubject}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap shadow-sm font-sans">
                    {claimResult.emailBody}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  Note: WarrantyVault creates drafts for your convenience. Claims are never sent automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
