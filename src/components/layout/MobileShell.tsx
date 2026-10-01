import React, { useState } from "react";
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Sparkles, 
  Layers,
  Maximize2,
  Minimize2
} from "lucide-react";

interface MobileShellProps {
  children: React.ReactNode;
  activeTabTitle?: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, activeTabTitle }) => {
  const [deviceFrame, setDeviceFrame] = useState<"iphone" | "android" | "fullscreen">("iphone");

  // Current simulated time
  const currentTime = "9:41";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-stone-50 to-emerald-50/30 flex flex-col items-center justify-center p-0 md:p-4 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Device Switcher bar for desktop preview */}
      <header className="hidden md:flex items-center justify-between w-full max-w-md mb-2 px-3.5 py-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 tracking-tight">WarrantyVault</span>
          <span className="text-slate-400 text-[11px]">· Mobile Preview</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setDeviceFrame("iphone")}
            className={`px-2.5 py-0.5 rounded-lg transition-all text-[11px] font-semibold ${
              deviceFrame === "iphone"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setDeviceFrame("android")}
            className={`px-2.5 py-0.5 rounded-lg transition-all text-[11px] font-semibold ${
              deviceFrame === "android"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Pixel
          </button>
          <button
            onClick={() => setDeviceFrame("fullscreen")}
            className={`px-2.5 py-0.5 rounded-lg transition-all text-[11px] font-semibold ${
              deviceFrame === "fullscreen"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Full
          </button>
        </div>
      </header>

      {/* Device Frame */}
      <div
        className={`w-full transition-all duration-300 flex flex-col relative overflow-hidden bg-[#F8FAFC] text-slate-800 ${
          deviceFrame === "fullscreen"
            ? "max-w-xl h-screen md:h-[92vh] md:rounded-3xl border-0 md:border md:border-slate-200/80 shadow-2xl"
            : deviceFrame === "iphone"
            ? "max-w-[420px] h-screen md:h-[870px] md:rounded-[52px] border-0 md:border-[10px] md:border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/50"
            : "max-w-[412px] h-screen md:h-[860px] md:rounded-[44px] border-0 md:border-[8px] md:border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/50"
        }`}
      >
        {/* Dynamic Island / Notch for iPhone */}
        {deviceFrame === "iphone" && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5 pointer-events-none shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800/50" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
          </div>
        )}

        {/* Camera Hole for Android Pixel */}
        {deviceFrame === "android" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 pointer-events-none ring-1 ring-slate-800" />
        )}

        {/* Status Bar */}
        <div className="pt-2.5 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-700 z-40 select-none bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/40">
          <span className="tracking-tight font-mono text-[13px] font-bold text-slate-800">{currentTime}</span>
          <div className="flex items-center gap-2 text-slate-700">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold">100%</span>
              <Battery className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scrollbar-none bg-[#F8FAFC]">
          {children}
        </main>

        {/* Bottom Home Indicator for iPhone */}
        {deviceFrame === "iphone" && (
          <div className="w-full flex justify-center py-2 bg-[#F8FAFC]/95 pointer-events-none select-none z-50">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
