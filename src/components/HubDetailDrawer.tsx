import { useState } from "react";
import { 
  X, MapPin, Users, Package, History, 
  CheckCircle2, AlertCircle, Clock, TrendingUp, User 
} from "lucide-react";
import { StatusPill } from "./ui";
import { formatKg } from "@/lib/cn";
import { useHubDetails } from "@/hooks/useAdmin";

interface HubDetailDrawerProps {
  hubId: string | null;
  onClose: () => void;
}

export function HubDetailDrawer({ hubId, onClose }: HubDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: details, isLoading } = useHubDetails(hubId);

  if (!hubId) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform ${hubId ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-charcoal text-white flex items-center justify-center font-black text-xl">
              {details?.hub?.name?.[0] || "H"}
            </div>
            <div>
              <h2 className="text-xl font-black">{details?.hub?.name || "Loading..."}</h2>
              <div className="text-xs text-textgray uppercase tracking-widest font-bold">
                Collection Hub • ID: {hubId.slice(0, 8)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bordergray bg-cream/30 px-6">
          {["overview", "agents", "inventory"].map((tab) => (
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
          {isLoading || !details ? (
            <div className="flex h-full items-center justify-center py-20 text-textgray animate-pulse font-bold">
              Fetching complete hub profile...
            </div>
          ) : (
            <div className="space-y-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-4">
                      <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Occupancy</div>
                      <div className="text-2xl font-black mt-1">
                        {Math.round((details.stats.currentStock / details.stats.totalCapacity) * 100)}%
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-bordergray overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(details.stats.currentStock / details.stats.totalCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Active Agents</div>
                      <div className="text-2xl font-black mt-1">{details.stats.totalAgents}</div>
                    </div>
                  </div>

                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Location & Manager</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray shrink-0"><MapPin size={14} /></div>
                        <div>
                          <div className="font-bold">{details.hub.location}</div>
                          <div className="text-xs text-textgray">Primary Collection Center</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray shrink-0"><User size={14} /></div>
                        <div>
                          <div className="font-bold">{details.hub.ownerAgent?.user?.firstName} {details.hub.ownerAgent?.user?.lastName}</div>
                          <div className="text-xs text-textgray">Hub Manager • {details.hub.ownerAgent?.user?.email}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "agents" && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Attached Agents</h3>
                  {details.agents.length === 0 ? (
                    <div className="text-center py-10 text-xs text-textgray border-2 border-dashed border-bordergray rounded-2xl">No agents assigned to this hub.</div>
                  ) : details.agents.map((agent: any) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl border border-bordergray hover:bg-cream/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {agent.user?.firstName?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{agent.user?.firstName} {agent.user?.lastName}</div>
                          <div className="text-[10px] text-textgray font-bold uppercase tracking-tighter">{agent.tier} Agent • {agent.type}</div>
                        </div>
                      </div>
                      <StatusPill status={agent.isActive ? "success" : "error"} label={agent.isActive ? "Active" : "Offline"} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "inventory" && (
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Material Breakdown</h3>
                  <div className="space-y-3">
                    {details.inventory.length === 0 ? (
                      <div className="text-center py-10 text-xs text-textgray border-2 border-dashed border-bordergray rounded-2xl">Inventory is currently empty.</div>
                    ) : details.inventory.map((inv: any) => (
                      <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/20 border border-bordergray">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white border border-bordergray flex items-center justify-center text-charcoal shadow-sm">
                            <Package size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{inv.category?.name}</div>
                            <div className="text-[10px] text-textgray font-bold uppercase">Last updated {new Date(inv.updatedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black">{formatKg(inv.currentWeightKg)}</div>
                          <div className="text-[10px] font-bold text-primary uppercase">In Stock</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
