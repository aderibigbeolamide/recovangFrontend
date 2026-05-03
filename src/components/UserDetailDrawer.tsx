import { useState } from "react";
import { 
  X, Mail, Phone, MapPin, Shield, Wallet, History, FileText, 
  CheckCircle2, AlertCircle, Clock, ExternalLink, UserCheck, UserX, MessageSquare, Send, Plus
} from "lucide-react";
import { StatusPill } from "./ui";
import { formatNaira, formatKg } from "@/lib/cn";
import { 
  useUserDetails, useSuspendUser, useUnsuspendUser, 
  useVerifyKYC, useRejectKYC, useUserNotes, useAddUserNote, useUserMessages 
} from "@/hooks/useAdmin";
import { MessageUserModal } from "./MessageUserModal";
import { PermissionGuard } from "./PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";

interface UserDetailDrawerProps {
  userId: string | null;
  onClose: () => void;
}

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  
  const { data: details, isLoading } = useUserDetails(userId);
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: unsuspendUser, isPending: isUnsuspending } = useUnsuspendUser();
  const { mutate: verifyKYC, isPending: isVerifying } = useVerifyKYC();
  const { mutate: rejectKYC, isPending: isRejecting } = useRejectKYC();
  const { data: notes, isLoading: isLoadingNotes } = useUserNotes(userId);
  const { mutate: addNote, isPending: isAddingNote } = useAddUserNote();
  const { data: messages, isLoading: isLoadingMessages } = useUserMessages(userId);

  const handleAddNote = () => {
    if (!newNote || !userId) return;
    addNote({ userId, content: newNote }, {
      onSuccess: () => setNewNote("")
    });
  };

  if (!userId) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform ${userId ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
              {details?.user?.firstName?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-xl font-black">{details?.user?.firstName} {details?.user?.lastName}</h2>
              <div className="text-xs text-textgray uppercase tracking-widest font-bold">
                {details?.user?.role} • ID: {userId.slice(0, 8)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PermissionGuard permission={PERMISSIONS.USERS_MESSAGE}>
              <button 
                onClick={() => setShowMessageModal(true)}
                className="rounded-full p-2 hover:bg-primary/10 text-primary transition-colors"
                title="Send Direct Message"
              >
                <MessageSquare size={20} />
              </button>
            </PermissionGuard>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bordergray bg-cream/30 px-6 overflow-x-auto">
          {["overview", "documents", "financials", "notes", "messages", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-textgray hover:text-charcoal"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-20 text-textgray animate-pulse font-bold">
              Fetching complete user profile...
            </div>
          ) : (
            <div className="space-y-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray"><Mail size={14} /></div>
                        <span className="font-bold">{details.user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray"><Phone size={14} /></div>
                        <span className="font-bold">{details.user.phoneNumber || "Not provided"}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Platform Status</h3>
                    <div className="rounded-2xl border border-bordergray p-4 flex items-center justify-between bg-cream/20">
                      <div>
                        <div className="text-xs font-bold mb-1">Account Status</div>
                        <StatusPill 
                          status={details.user.isActive ? "success" : "error"} 
                          label={details.user.isActive ? "Active" : "Suspended"} 
                        />
                      </div>
                      <PermissionGuard permission={PERMISSIONS.USERS_SUSPEND}>
                        {details.user.isActive ? (
                          <button 
                            onClick={() => suspendUser(userId)}
                            disabled={isSuspending}
                            className="btn-outline border-error/20 text-error hover:bg-error hover:text-white btn-sm"
                          >
                            <UserX size={14} className="mr-2" /> Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => unsuspendUser(userId)}
                            disabled={isUnsuspending}
                            className="btn-primary btn-sm"
                          >
                            <UserCheck size={14} className="mr-2" /> Activate
                          </button>
                        )}
                      </PermissionGuard>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Location Details</h3>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray shrink-0"><MapPin size={14} /></div>
                      <div>
                        <div className="font-bold">{details.profile?.address || "No primary address"}</div>
                        <div className="text-xs text-textgray">{details.profile?.lga}, {details.profile?.state}</div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-6">
                  {details.documents?.map((doc: any) => (
                    <div key={doc.id} className="card p-4 overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-bold text-sm">{doc.name}</div>
                          <div className="text-[10px] text-textgray uppercase font-bold tracking-tighter">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                        </div>
                        <StatusPill status={doc.status?.toLowerCase() === "verified" ? "success" : "warning"} label={doc.status?.toUpperCase()} />
                      </div>
                      <div className="aspect-video rounded-xl bg-charcoal/5 border border-bordergray relative group">
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="btn-primary btn-sm gap-2">
                            <ExternalLink size={14} /> View Full Size
                          </button>
                        </div>
                      </div>
                      <PermissionGuard permission={PERMISSIONS.USERS_KYC}>
                        {doc.status?.toLowerCase() === "pending" && (
                          <div className="mt-4 flex gap-2">
                            <button 
                              className="btn-primary flex-1 btn-sm"
                              disabled={isVerifying}
                              onClick={() => verifyKYC(userId)}
                            >
                              {isVerifying ? "Verifying..." : "Verify Document"}
                            </button>
                            <button 
                              className="btn-outline flex-1 btn-sm border-error/30 text-error hover:bg-error/5"
                              disabled={isRejecting}
                              onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) rejectKYC({ userId, reason });
                              }}
                            >
                              {isRejecting ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        )}
                      </PermissionGuard>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "financials" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-4 bg-primary/5 border-primary/20">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Balance</div>
                      <div className="text-2xl font-black mt-1">{formatNaira(details.wallet.balance)}</div>
                    </div>
                    <div className="card p-4">
                      <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Total Earned</div>
                      <div className="text-2xl font-black mt-1">{formatNaira(details.wallet.totalEarned)}</div>
                    </div>
                  </div>

                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Recent Payouts</h3>
                    <div className="space-y-3">
                      {details.transactions?.length === 0 ? (
                        <div className="text-center py-10 text-xs text-textgray border-2 border-dashed border-bordergray rounded-2xl">No payouts recorded.</div>
                      ) : details.transactions.map((tx: any) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-bordergray">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Wallet size={14} /></div>
                            <div>
                              <div className="text-sm font-bold">{formatNaira(tx.amount)}</div>
                              <div className="text-[10px] text-textgray font-bold">{tx.type} • {new Date(tx.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <StatusPill status={tx.status === "COMPLETED" ? "success" : "warning"} label={tx.status} />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Internal Admin Notes</h3>
                    <div className="space-y-4">
                      <PermissionGuard permission={PERMISSIONS.USERS_NOTES}>
                        <div className="relative">
                          <textarea 
                            className="input w-full min-h-[100px] py-3 pr-12"
                            placeholder="Type an internal note about this user..."
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                          />
                          <button 
                            onClick={handleAddNote}
                            disabled={isAddingNote || !newNote}
                            className="absolute right-3 bottom-3 h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </PermissionGuard>

                      <div className="space-y-3">
                        {isLoadingNotes ? (
                          <div className="text-center py-4 text-xs text-textgray animate-pulse">Loading notes...</div>
                        ) : notes?.length === 0 ? (
                          <div className="text-center py-8 text-xs text-textgray border-2 border-dashed border-bordergray rounded-2xl">
                            No internal notes yet.
                          </div>
                        ) : notes?.map((note: any) => (
                          <div key={note.id} className="p-4 rounded-2xl bg-cream/20 border border-bordergray/50 relative group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">
                                  {note.admin?.firstName?.[0]}
                                </div>
                                <span className="text-xs font-bold text-charcoal">{note.admin?.firstName} {note.admin?.lastName}</span>
                              </div>
                              <span className="text-[10px] text-textgray font-bold">{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-textgray leading-relaxed">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "messages" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Communication History</h3>
                    <div className="space-y-4">
                      {isLoadingMessages ? (
                        <div className="text-center py-10 text-xs text-textgray animate-pulse">Loading history...</div>
                      ) : messages?.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-bordergray rounded-3xl flex flex-col items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center text-textgray mb-3"><MessageSquare size={20} /></div>
                          <div className="text-xs font-bold text-charcoal">No messages sent yet</div>
                          <div className="text-[10px] text-textgray mt-1">Direct messages you send will appear here.</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg: any) => (
                            <div key={msg.id} className="p-5 rounded-2xl bg-white border border-bordergray shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black uppercase">
                                    {msg.admin?.firstName?.[0] || "A"}
                                  </div>
                                  <div className="text-xs font-bold">{msg.admin?.firstName} {msg.admin?.lastName}</div>
                                </div>
                                <div className="text-[10px] text-textgray font-bold">{new Date(msg.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div className="font-bold text-sm text-charcoal mb-1">{msg.title}</div>
                              <p className="text-xs text-textgray leading-relaxed">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Administrative History</h3>
                    <div className="relative border-l-2 border-bordergray ml-3 pl-6 space-y-8 py-2">
                      {details.logs?.length === 0 ? (
                        <div className="text-xs text-textgray ml-[-6px]">No audit logs found for this user.</div>
                      ) : details.logs.map((log: any) => (
                        <div key={log.id} className="relative">
                          <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-primary shadow-sm" />
                          <div className="text-sm font-bold">{log.action.replace(/_/g, " ")}</div>
                          <div className="text-xs text-textgray mt-0.5">By {log.admin?.firstName} {log.admin?.lastName}</div>
                          <div className="text-[10px] text-textgray font-bold flex items-center gap-1 mt-1">
                            <Clock size={10} /> {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <MessageUserModal 
        open={showMessageModal} 
        onClose={() => setShowMessageModal(false)} 
        userId={userId} 
        userName={`${details?.user?.firstName} ${details?.user?.lastName}`}
      />
    </div>
  );
}
