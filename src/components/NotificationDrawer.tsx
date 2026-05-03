import { useState } from "react";
import { 
  X, Bell, MessageSquare, Send, User, 
  ShieldCheck, Headset, Sparkles, Clock, 
  CheckCircle2, Info, AlertTriangle, Gift, Coins, Wallet
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NotificationDrawerProps {
  notification: any | null;
  onClose: () => void;
}

const TYPE_MAP: any = {
  earning: { icon: Coins, color: "bg-success-50 text-success", label: "Earning" },
  system: { icon: Bell, color: "bg-mint text-primary", label: "System" },
  wallet: { icon: Wallet, color: "bg-cream text-charcoal", label: "Wallet" },
  dispute: { icon: AlertTriangle, color: "bg-warning-50 text-warning", label: "Dispute" },
  promo: { icon: Gift, color: "bg-mint text-primary", label: "Promotion" },
};

export function NotificationDrawer({ notification, onClose }: NotificationDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { id: 1, role: "support", text: "Hello! How can we help you regarding this notification?", time: "Just now" }
  ]);

  if (!notification) return null;

  const config = TYPE_MAP[notification.type] || TYPE_MAP.system;
  const Icon = config.icon;

  function sendMessage() {
    if (!message.trim()) return;
    const newMessage = { id: Date.now(), role: "user", text: message, time: "Just now" };
    setChat([...chat, newMessage]);
    setMessage("");
    
    // Simulate support response
    setTimeout(() => {
        setChat(prev => [...prev, { 
            id: Date.now() + 1, 
            role: "support", 
            text: "Thanks for reaching out! Our team will get back to you shortly.", 
            time: "Just now" 
        }]);
    }, 1000);
  }

  return (
    <div className={cn(
      "fixed inset-0 z-[100] transition-opacity duration-300",
      notification ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className={cn(
        "absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform",
        notification ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div className="flex items-center gap-4">
              <div className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-soft", config.color)}>
                <Icon size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-charcoal truncate max-w-[280px]">{notification.title}</h2>
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">
                   {config.label} Alert • {new Date(notification.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors text-textgray hover:text-charcoal">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-bordergray bg-cream/30 px-6">
            {[
              { id: "details", label: "Details", icon: Info },
              { id: "support", label: "Support Chat", icon: Headset }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === t.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-textgray hover:text-charcoal hover:bg-white/50"
                )}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "details" ? (
              <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <section>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-4">Message Content</div>
                    <div className="rounded-3xl bg-cream/40 p-6 border border-bordergray">
                        <p className="text-lg leading-relaxed text-charcoal font-medium">
                            {notification.message}
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="card p-5">
                        <div className="flex items-center gap-2 text-textgray mb-2">
                            <Clock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Received</span>
                        </div>
                        <div className="text-sm font-bold">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-textgray mt-0.5">
                            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="card p-5">
                        <div className="flex items-center gap-2 text-textgray mb-2">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Verified by</span>
                        </div>
                        <div className="text-sm font-bold">Recovang System</div>
                        <div className="text-xs text-success font-bold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Secure Transaction
                        </div>
                    </div>
                </section>

                <div className="card-dark p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-charcoal">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Need help with this?</h4>
                            <p className="text-xs text-white/60">Talk to our 24/7 support team</p>
                        </div>
                        <button 
                            onClick={() => setActiveTab("support")}
                            className="ml-auto btn-gold btn-sm"
                        >
                            Start Chat
                        </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col animate-in fade-in duration-300">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {chat.map((c) => (
                        <div key={c.id} className={cn(
                            "flex flex-col max-w-[85%]",
                            c.role === "user" ? "ml-auto items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "px-4 py-3 rounded-2xl text-sm font-medium",
                                c.role === "user" 
                                    ? "bg-primary text-white rounded-tr-none shadow-lg" 
                                    : "bg-cream text-charcoal rounded-tl-none border border-bordergray"
                            )}>
                                {c.text}
                            </div>
                            <span className="text-[9px] font-bold text-textgray uppercase mt-1 px-1">
                                {c.role === "support" ? "Support • " : "You • "} {c.time}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white border-t border-bordergray">
                    <div className="flex gap-2">
                        <input 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..." 
                            className="input flex-1 h-11"
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className="btn-primary h-11 w-11 p-0 flex items-center justify-center disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
