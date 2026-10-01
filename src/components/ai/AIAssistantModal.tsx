import React, { useState } from "react";
import { Product } from "../../types";
import { AIService } from "../../services/ai-service";
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User 
} from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello! I'm your WarrantyVault assistant. I have access to your ${products.length} registered products, invoices, and service records. What would you like to know?`,
    },
  ]);

  const promptSuggestions = [
    "Is my TV still under warranty?",
    "What do I need for a warranty claim on my laptop?",
    "Find my laptop invoice",
    "How much have I spent on electronics?",
    "Which warranties expire this month?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const answer = await AIService.answerInventoryQuestion(textToSend, products);
      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I couldn't query your vault right now. Please check your connection or browse your products in the Products tab.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Vault AI Assistant</h2>
              <p className="text-[11px] text-slate-500 font-medium">Strictly grounded in your registered items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-slate-200 text-emerald-700 shadow-sm"
                }`}
              >
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[82%] text-xs leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none font-semibold"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
              <span>Checking your product records...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto scrollbar-none flex items-center gap-2">
          {promptSuggestions.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your warranties, receipts..."
            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all active:scale-95 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
