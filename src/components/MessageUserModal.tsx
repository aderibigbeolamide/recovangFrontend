import { useState } from "react";
import { Modal } from "./Modal";
import { Send, X } from "lucide-react";
import { useSendMessage } from "@/hooks/useAdmin";

interface MessageUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function MessageUserModal({ open, onClose, userId, userName }: MessageUserModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSend = () => {
    if (!title || !message) return;
    sendMessage({ userId, title, message }, {
      onSuccess: () => {
        setTitle("");
        setMessage("");
        onClose();
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Direct Message"
      description={`Compose a message for ${userName}. They will receive this via in-app notification and email.`}
      footer={
        <>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary gap-2" 
            disabled={!title || !message || isPending}
            onClick={handleSend}
          >
            <Send size={14} /> {isPending ? "Sending..." : "Send Message"}
          </button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-textgray">Subject / Title</label>
          <input 
            className="input w-full" 
            placeholder="e.g. Account Verification Update" 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-textgray">Message Body</label>
          <textarea 
            className="input w-full min-h-[120px] py-3" 
            placeholder="Write your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
