import React, { useState } from "react";
import { Household, HouseholdMember } from "../../types";
import { Users, X, UserPlus, Shield, Trash2 } from "lucide-react";

interface HouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household;
  onUpdateHousehold: (household: Household) => void;
}

export const HouseholdModal: React.FC<HouseholdModalProps> = ({
  isOpen,
  onClose,
  household,
  onUpdateHousehold,
}) => {
  if (!isOpen) return null;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Editor" | "Viewer">("Editor");

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: HouseholdMember = {
      id: "user-" + Date.now(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatarColor: inviteRole === "Editor" ? "bg-blue-600" : "bg-purple-600",
      isCurrentUser: false,
    };

    onUpdateHousehold({
      ...household,
      members: [...household.members, newMember],
    });

    setInviteName("");
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    onUpdateHousehold({
      ...household,
      members: household.members.filter((m) => m.id !== memberId),
    });
  };

  const handleChangeRole = (memberId: string, newRole: "Owner" | "Editor" | "Viewer") => {
    onUpdateHousehold({
      ...household,
      members: household.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Household Sharing</h2>
              <p className="text-[11px] text-slate-500 font-medium">Vault: {household.name}</p>
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
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Family and household members can view warranties, receipts, and service logs according to their assigned roles.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Members ({household.members.length})
              </span>
              <button
                onClick={() => setShowInviteModal(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Member</span>
              </button>
            </div>

            <div className="space-y-2">
              {household.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl ${member.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-sm`}
                    >
                      {member.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{member.name}</span>
                        {member.isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block font-medium">{member.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.role === "Owner" ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800">
                        Owner
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleChangeRole(member.id, e.target.value as "Editor" | "Viewer")
                        }
                        className="text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none shadow-sm"
                      >
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )}

                    {!member.isCurrentUser && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Member Drawer */}
          {showInviteModal && (
            <form onSubmit={handleInviteMember} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Invite Family Member</span>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Access Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "Editor" | "Viewer")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Editor">Editor (Can add/edit items & service records)</option>
                    <option value="Viewer">Viewer (Read-only access)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Send Invite
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
