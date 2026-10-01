import React, { useState } from "react";
import { AlertNotification } from "../../types";
import { formatDate } from "../../core/date-utils";
import { 
  Bell, 
  Clock, 
  ShieldAlert, 
  FileWarning, 
  CheckCheck, 
  Inbox
} from "lucide-react";

interface AlertsScreenProps {
  alerts: AlertNotification[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
  onSelectProductById: (productId?: string) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectProductById,
}) => {
  const [activeTab, setActiveTab] = useState<"urgent" | "upcoming" | "all">("all");

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === "urgent") return a.urgency === "urgent";
    if (activeTab === "upcoming") return a.urgency === "upcoming" || a.urgency === "info";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const getAlertIcon = (type: AlertNotification["type"]) => {
    switch (type) {
      case "return_warning":
        return <Clock className="w-4 h-4 text-rose-600" />;
      case "warranty_warning":
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "missing_invoice":
        return <FileWarning className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Alerts & Reminders</h1>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All clear"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex rounded-2xl bg-white p-1 border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "all"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab("urgent")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "urgent"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Urgent ({alerts.filter((a) => a.urgency === "urgent").length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "upcoming"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Upcoming ({alerts.filter((a) => a.urgency !== "urgent").length})
        </button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">You're all caught up.</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              No pending warranty or return notifications right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                onMarkAsRead(alert.id);
                if (alert.productId) onSelectProductById(alert.productId);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-sm ${
                !alert.read
                  ? alert.urgency === "urgent"
                    ? "bg-rose-50/70 border-rose-200 hover:border-rose-300"
                    : "bg-white border-emerald-300 hover:border-emerald-400"
                  : "bg-white/80 border-slate-200 hover:bg-white text-slate-500"
              }`}
            >
              {!alert.read && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500" />
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.urgency === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : alert.type === "missing_invoice"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {getAlertIcon(alert.type)}
                </div>

                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${!alert.read ? "text-slate-900" : "text-slate-700"}`}>
                      {alert.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                    <span>{formatDate(alert.date)}</span>
                    {alert.productName && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">{alert.productName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
