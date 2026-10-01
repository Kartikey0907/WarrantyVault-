import React, { useState } from "react";
import { UserProfile, UserSettings, Product, Household } from "../../types";
import { ExportService } from "../../services/export-service";
import { 
  Bell, 
  ShieldCheck, 
  Lock, 
  Download, 
  Trash2, 
  LogOut, 
  ChevronRight, 
  Users, 
  RefreshCw, 
  FileText, 
  AlertCircle,
  Tag
} from "lucide-react";

interface ProfileScreenProps {
  user: UserProfile | null;
  settings: UserSettings;
  products: Product[];
  household: Household;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onResetSampleData: () => void;
  onOpenHousehold: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  settings,
  products,
  household,
  onUpdateSettings,
  onLogout,
  onDeleteAccount,
  onResetSampleData,
  onOpenHousehold,
}) => {
  const [activeModal, setActiveModal] = useState<
    "notifications" | "privacy" | "security" | "resale" | "export" | "delete" | null
  >(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleExportCSV = () => {
    ExportService.exportProductsCSV(products);
    setActiveModal(null);
  };

  const handleExportJSON = () => {
    ExportService.exportProductsJSON(products);
    setActiveModal(null);
  };

  const displayName = user?.name || "Vault Guest";
  const displayEmail = user?.email || "guest@warrantyvault.local";

  return (
    <div className="flex-1 flex flex-col p-4 pb-14 space-y-4">
      {/* Header Profile Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
            {displayName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900">{displayName}</h1>
              {user?.isGuest && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{displayEmail}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              {products.length} registered products vaulted
            </p>
          </div>
        </div>
      </div>

      {/* Settings Navigation List */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Preferences & Controls
        </span>

        {/* Notification Settings */}
        <button
          onClick={() => setActiveModal("notifications")}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Notification Timing</h3>
              <p className="text-[11px] text-slate-500">Quiet hours, warranty & return reminders</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Household Sharing */}
        <button
          onClick={onOpenHousehold}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Household Sharing</h3>
              <p className="text-[11px] text-slate-500">
                {household.members.length} members · Vault: {household.name}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Resale Readiness Tracker */}
        <button
          onClick={() => setActiveModal("resale")}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Resale Tracker & Condition</h3>
              <p className="text-[11px] text-slate-500">Box, accessories, warranty resale score</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Security & App Lock */}
        <button
          onClick={() => setActiveModal("security")}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/60">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Security & App Lock</h3>
              <p className="text-[11px] text-slate-500">PIN protection & biometric unlock</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Privacy Center */}
        <button
          onClick={() => setActiveModal("privacy")}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Privacy Center</h3>
              <p className="text-[11px] text-slate-500">Encrypted storage & offline guarantee</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Export Data */}
        <button
          onClick={() => setActiveModal("export")}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Export Vault Data</h3>
              <p className="text-[11px] text-slate-500">Download inventory in CSV & JSON</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Reset to Sample Data */}
        <button
          onClick={onResetSampleData}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all active:scale-99 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Reset Demo Data</h3>
              <p className="text-[11px] text-slate-500">Reload canonical sample products & alerts</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Account Actions */}
      <div className="pt-2 space-y-2">
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>{user?.isGuest ? "Exit Guest Mode" : "Log Out"}</span>
        </button>

        <button
          onClick={() => setActiveModal("delete")}
          className="w-full py-2.5 rounded-2xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account & Purge Data</span>
        </button>
      </div>

      {/* MODAL: Notification Settings */}
      {activeModal === "notifications" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Notification Timing</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Return Window Alerts</span>
                  <span className="text-[11px] text-slate-500 block">7, 3, and 1 day before closing</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.returnRemindersEnabled}
                  onChange={(e) => onUpdateSettings({ returnRemindersEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Warranty Expiry Alerts</span>
                  <span className="text-[11px] text-slate-500 block">90, 30, 7, and 1 day before expiry</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.warrantyRemindersEnabled}
                  onChange={(e) => onUpdateSettings({ warrantyRemindersEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Quiet Hours</span>
                    <span className="text-[11px] text-slate-500 block">No sound notifications at night</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.quietHoursEnabled}
                    onChange={(e) => onUpdateSettings({ quietHoursEnabled: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <span>From: 22:00</span>
                  <span>·</span>
                  <span>Until: 08:00</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Resale Readiness Tracker */}
      {activeModal === "resale" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Resale Readiness Tracker</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <p className="text-[11px] text-slate-500">
                Tracking original invoices, packaging, and active warranty significantly boosts secondhand resale value.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Sony WH-CH720N</span>
                  <span className="text-emerald-700 font-extrabold">Score: 95/100</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  ✓ Original Box · ✓ Receipt Stored · ✓ Under Warranty
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Dell Inspiron Laptop</span>
                  <span className="text-emerald-700 font-extrabold">Score: 90/100</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  ✓ Original Box · ✓ Service Logs · ✓ Original Charger
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Security */}
      {activeModal === "security" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">App Security & Lock</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Biometric Unlock (FaceID / Fingerprint)</span>
                  <span className="text-[11px] text-slate-500 block">Require unlock to view receipts</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.biometricLockEnabled}
                  onChange={(e) => onUpdateSettings({ biometricLockEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                Encrypted storage tokens protect your document attachments and purchase history.
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Privacy Center */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Privacy Guarantee</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Zero Unnecessary Permissions</span>
                <p className="text-[11px] text-slate-500">
                  WarrantyVault never requests your location, contacts, microphone, or external email logins.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Offline First Architecture</span>
                <p className="text-[11px] text-slate-500">
                  Your receipts and warranty records are cached locally on your device for instant offline access.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Export */}
      {activeModal === "export" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Export Vault Inventory</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Download your full registered product records, serial numbers, purchase dates, and warranty milestones.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleExportCSV}
                className="py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-5 h-5 text-teal-600" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Account */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Permanently Delete Account?</h3>
              <p className="text-xs text-slate-500">
                This will delete your user profile, all registered products, receipts, and service logs permanently.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[11px] text-slate-500 block">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmText === "DELETE") {
                    onDeleteAccount();
                    setActiveModal(null);
                  }
                }}
                disabled={deleteConfirmText !== "DELETE"}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold"
              >
                Wipe All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
