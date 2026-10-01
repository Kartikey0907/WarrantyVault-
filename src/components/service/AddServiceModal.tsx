import React, { useState } from "react";
import { Product, ServiceRecord } from "../../types";
import { X, Wrench, AlertCircle } from "lucide-react";

interface AddServiceModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onSaveServiceRecord: (record: Omit<ServiceRecord, "id" | "createdAt">) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  product,
  onClose,
  onSaveServiceRecord,
}) => {
  if (!isOpen) return null;

  const [serviceDate, setServiceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [serviceCenter, setServiceCenter] = useState("");
  const [problem, setProblem] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [repairPerformed, setRepairPerformed] = useState("");
  const [cost, setCost] = useState("0");
  const [warrantyClaimUsed, setWarrantyClaimUsed] = useState(true);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!serviceCenter.trim()) {
      setErrorMessage("Please enter the service center name.");
      return;
    }
    if (!problem.trim()) {
      setErrorMessage("Please describe the reported issue.");
      return;
    }

    onSaveServiceRecord({
      productId: product.id,
      serviceDate,
      serviceCenter: serviceCenter.trim(),
      problem: problem.trim(),
      diagnosis: diagnosis.trim() || undefined,
      repairPerformed: repairPerformed.trim() || "Inspection & Repair",
      cost: parseFloat(cost) || 0,
      currency: "INR",
      warrantyClaimUsed,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Service Record</h2>
              <p className="text-[11px] text-slate-500 font-medium">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 font-medium block mb-1">Service Date</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-medium block mb-1">Repair Cost (₹)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1">
              Authorized Service Center / Workshop <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={serviceCenter}
              onChange={(e) => setServiceCenter(e.target.value)}
              placeholder="e.g. Authorized Sony Care Center, MG Road"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1">
              Reported Problem / Defect <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Keyboard keys sticking, battery draining fast"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1">Diagnosis by Technician</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Faulty membrane contact switch"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1">Repair Performed</label>
            <input
              type="text"
              value={repairPerformed}
              onChange={(e) => setRepairPerformed(e.target.value)}
              placeholder="e.g. Replaced internal keyboard assembly under warranty"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Warranty Claim Used Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Serviced Under Warranty Claim</span>
              <span className="text-[11px] text-slate-500 block">Covered free of charge by manufacturer/seller</span>
            </div>
            <input
              type="checkbox"
              checked={warrantyClaimUsed}
              onChange={(e) => setWarrantyClaimUsed(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1">Technician Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Service ticket #TK-89104. Picked up on same day."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              Save Service Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
