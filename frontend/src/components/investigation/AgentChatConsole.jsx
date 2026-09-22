import { useState } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "../common/Button";

export function AgentChatConsole({ incidentService = "payment-api" }) {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "agent",
      text: `Hello Commander. I've finished correlating the logs, commits, and knowledge runbooks for ${incidentService}. What questions do you have about this investigation?`,
      time: "09:03",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "What was the connection pool limit before deployment v2.4.0?",
    "Has this error occurred in any previous incident?",
    "Will rollback require any database migrations or data backfill?",
  ];

  const getSimulatedResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("pool") || q.includes("limit") || q.includes("before")) {
      return "Prior to deployment v2.4.0, DB_POOL_MAX was set to 50 connections with a 30.0s query timeout in config/database.py (commit 3a99e01). Under normal traffic of 850 req/s, the application safely hovered around 18-24 active connections.";
    }
    if (q.includes("previous") || q.includes("incident") || q.includes("occurred")) {
      return "Yes. Knowledge Agent found an 95% similarity match with incident INC-023 ('Payment API Latency') from August. The root cause was also an inadvertent reduction in database pool limits, resolved by reverting the config file.";
    }
    if (q.includes("rollback") || q.includes("migration") || q.includes("backfill")) {
      return "No schema migrations or data backfills were introduced in v2.4.0. Rollback to v2.3.9 is completely zero-downtime and safe to execute immediately via Kubernetes rolling restart.";
    }
    return `Analysis across ${incidentService} telemetry indicates this is purely a configuration mismatch between the traffic throughput and the downstream PostgreSQL connection pool size. Rolling back to v2.3.9 is the safest immediate action.`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgId = `msg-usr-${messages.length + 1}`;
    const userMsg = {
      id: newMsgId,
      sender: "user",
      text: query,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-agent-${prev.length + 1}`,
          sender: "agent",
          text: getSimulatedResponse(query),
          time: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs md:text-sm font-semibold text-slate-100 font-mono">
            Interactive Investigation Assistant
          </h3>
        </div>
        <span className="text-[11px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
          Agent Live
        </span>
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-64 overflow-y-auto font-sans text-xs p-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                m.sender === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-purple-600/30 text-purple-300 border border-purple-500/40"
              }`}
            >
              {m.sender === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/40"
                  : "bg-slate-950/80 text-slate-200 border border-slate-800"
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[10px] text-slate-400 block text-right mt-1 font-mono">
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic font-mono">
            <Bot className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>TraceOps Agent is reasoning...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the investigation agent about code, logs, or past incidents..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2.5 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={Send}
          disabled={!input.trim() || isTyping}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
