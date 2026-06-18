import React, { useState, useRef, useEffect } from "react";
import { Send, Map, Sparkles, AlertCircle, Shield, Award, PlayCircle, HelpCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Jai Hind! I am **Agni AI**, your personalized Armed Forces study companion. Ask me any general knowledge (GK) question, syllabus doubt, or strategic question for Agniveer, Navy, NDA, CDS, or SSC GD exams. Let's march towards selection!"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const preseededQueries = [
    { text: "Navy Father history", label: "Father of Indian Navy?" },
    { text: "Fundamental Duties Article 51A", label: "Fundamental Duties Summary" },
    { text: "Agniveer Selection steps", label: "Agniveer selection routine?" },
    { text: "Armed Forces ranks hierarchy", label: "Military commissions hierarchy?" }
  ];

  // Auto-scroll thread
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Append student client speech
    const newMsgList: ChatMessage[] = [...messages, { role: "user", text: messageText }];
    setMessages(newMsgList);
    setInputVal("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: newMsgList.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error("HTTP connection error to Agni API");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);

    } catch (err: any) {
      console.error("AI Assistant network failed:", err);
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: `I'm currently running in offline backup mode. We couldn't connect to our live server, but here is some essential advice: \n\n• **For GK Boards**: Consistently solve our curated mock tests.\n• **For Static History/Polity**: Focus on the Indian Constitution's preamble, directive principles, and primary military campaigns of 1965, 1971, and 1999 Kargil. \n\n*Tip: Connect your live GEMINI_API_KEY inside the Secrets tab to activate custom conversational search!*`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[520px]" id="ai-assistant-console">
      
      {/* Console blue header banner */}
      <div className="bg-[#000080] text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/10 rounded-full animate-pulse">
            <Sparkles className="h-5 w-5 text-[#FF9933]" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider">Agni AI Assistant</h4>
            <span className="text-[10px] text-indigo-200 block">Personalized Armed Forces Study Partner</span>
          </div>
        </div>

        <span className="text-[9px] font-mono bg-[#138808] text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest leading-none">
          Live Grounding Enabled
        </span>
      </div>

      {/* Messages Board Scroller */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50" 
        id="chat-messages-scroller"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-fade-in"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-[#000080] text-white rounded-tr-none font-sans font-semibold"
                  : "bg-white text-gray-800 border border-gray-150 rounded-tl-none font-sans whitespace-pre-wrap"
              }`}
            >
              {/* Parse nested basic bullet lists on the screen for mock Markdown */}
              <div>{m.text}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-center space-x-2" id="chat-loading-animation">
            <div className="bg-white border rounded-xl rounded-tl-none p-3 shadow-sm text-xs text-gray-400 flex items-center space-x-1.5 font-mono italic">
              <span className="h-2 w-2 rounded-full bg-[#FF9933] animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-[#138808] animate-bounce [animation-delay:0.4s]" />
              <span>Agni AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Recommended dynamic queries pills row */}
      <div className="p-3 border-t border-gray-100 flex flex-nowrap items-center space-x-2 overflow-x-auto shrink-0 bg-white" id="pills-query-selectors">
        <span className="text-[9px] text-gray-400 uppercase font-mono tracking-wider shrink-0 flex items-center">
          <HelpCircle className="h-3.5 w-3.5 mr-0.5 text-[#000080]" />
          Pills:
        </span>
        
        {preseededQueries.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.text)}
            className="shrink-0 text-[10px] font-bold bg-gray-100 text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] border border-gray-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input console form widget */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center space-x-2 shrink-0" id="assistant-form-entry">
        <input
          type="text"
          id="ai-console-input-text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(inputVal);
          }}
          placeholder="Ask Agni AI (e.g. UPSC polity articles, NDA math strategy)..."
          className="flex-1 text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#000080] bg-white text-gray-800"
        />

        <button
          id="btn-send-chat"
          onClick={() => handleSend(inputVal)}
          className="bg-[#138808] hover:bg-[#117706] text-white p-3 rounded-xl shadow-md transition-colors flex items-center justify-center shrink-0"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}
