import React, { useState } from "react";
import { 
  ShieldCheck, 
  Receipt, 
  Clock, 
  Wrench, 
  Bell, 
  Camera, 
  ChevronRight, 
  ArrowRight 
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [notificationsGranted, setNotificationsGranted] = useState<boolean>(true);
  const [cameraGranted, setCameraGranted] = useState<boolean>(true);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F8FAFC] text-slate-800 min-h-full">
      {/* Top progress indicator */}
      <div className="flex items-center gap-2 pt-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              step >= s ? "bg-emerald-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Screen 1: Welcome & Tagline */}
      {step === 1 && (
        <div className="space-y-6 my-auto text-center py-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-50">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Welcome to WarrantyVault
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Keep everything you need to protect what you own.
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed pt-2 font-medium">
              "Never lose a receipt. Never miss a warranty."
            </p>
          </div>
        </div>
      )}

      {/* Screen 2: 4 Pillars */}
      {step === 2 && (
        <div className="space-y-5 my-auto py-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              The Digital Ownership Record
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">4 Pillars of Protection</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Store Receipts & Invoices</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Instant OCR extraction for GST bills, physical slips, and PDFs.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Track Return Windows</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Deadlines calculated automatically so return windows never close unnoticed.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Track Warranties</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Manufacturer, seller, and extended coverage countdowns with readiness checks.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Keep Service History</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Log maintenance, repairs, parts replaced, and warranty claim outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Minimal Permissions */}
      {step === 3 && (
        <div className="space-y-5 my-auto py-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Device Permissions
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Only What You Need</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
              We never request location, contacts, microphone, or external email accounts.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Expiry Notifications</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Receive reminders before return or warranty ends</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsGranted}
                onChange={(e) => setNotificationsGranted(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Camera & Receipt Upload</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Snap paper bills or attach digital receipts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={cameraGranted}
                onChange={(e) => setCameraGranted(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation button */}
      <div className="pt-4">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <span>Enter WarrantyVault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
