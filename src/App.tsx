import React, { useState } from "react";
import {
  Mic,
  Send,
  MapPin,
  Building2,
  Library,
  Navigation,
  Bot,
  Volume2,
  Loader2,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am JARVIS, your SJEC AI Campus Assistant. Ask me anything about the college.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [routeNodes, setRouteNodes] = useState<string[]>([]);
  const [destinationId, setDestinationId] = useState<string | null>(null);
 const routeCoordinates: Record<string, { x: number; y: number }> = {
  KIOSK_ENTRANCE: { x: 80, y: 250 },
  BLOCK_3_ELEVATOR: { x: 220, y: 190 },
  FLOOR_5_HALL: { x: 320, y: 250 },
  ROOM_3509: { x: 400, y: 160 },
};

const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMessage = input.trim();

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: userMessage,
    },
  ]);

  setInput("");
  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    setRouteNodes(data.route_nodes || []);
setDestinationId(data.destination_id || null);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: data.speech_text || "I couldn't find an answer.",
      },
    ]);

    console.log("RAG RESPONSE:", data);
  } catch (error) {
    console.error("Backend error:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "Backend connection failed. Please make sure the Python RAG backend is running.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);

      setTimeout(() => {
        sendVoiceQuestion(transcript);
      }, 100);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const sendVoiceQuestion = async (question: string) => {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      const answer =
        data.answer || "I couldn't find an answer.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answer,
        },
      ]);

      speak(answer);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the RAG backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-slate-950/95 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20">
              <Bot className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                JARVIS
              </h1>

              <p className="text-xs text-slate-400">
                SJEC AI Campus Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300">
              AI Online
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-3">
        {/* CHAT */}
        <section className="flex min-h-[700px] flex-col rounded-2xl border border-white/10 bg-slate-900 lg:col-span-2">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-bold">
              Ask JARVIS
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Ask questions about SJEC, departments, facilities,
              campus and academics.
            </p>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-white/10 bg-slate-800 text-slate-200"
                  }`}
                >
                  <p className="text-sm leading-6">
                    {message.text}
                  </p>

                  {message.role === "assistant" && (
                    <button
                      onClick={() => speak(message.text)}
                      className="mt-3 flex items-center gap-2 text-xs text-blue-300 hover:text-blue-200"
                    >
                      <Volume2 className="h-4 w-4" />
                      Speak
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-slate-400">
                    JARVIS is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <button
                onClick={startVoice}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                  listening
                    ? "bg-red-500 text-white"
                    : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                }`}
                title="Voice input"
              >
                <Mic className="h-5 w-5" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask JARVIS something..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {listening && (
              <p className="mt-2 text-center text-xs text-red-400">
                Listening...
              </p>
            )}
          </div>
        </section>

        {/* CAMPUS MAP */}
        <section className="rounded-2xl border border-white/10 bg-slate-900">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="font-bold">
                  SJEC Campus
                </h2>

                <p className="text-xs text-slate-400">
                  Mangaluru, Karnataka
                </p>
              </div>
            </div>

            <Navigation className="h-5 w-5 text-blue-400" />
          </div>

          <div className="relative h-[500px] overflow-hidden bg-[#0B1D3A]">
            {routeNodes.length > 1 && (
  <svg
    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    viewBox="0 0 500 500"
    preserveAspectRatio="none"
  >
    <polyline
  points={routeNodes
    .map((node) => {
      const point = routeCoordinates[node];
      return point ? `${point.x},${point.y}` : "";
    })
    .filter(Boolean)
    .join(" ")}
  fill="none"
  stroke="#3B82F6"
  strokeWidth="8"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeDasharray="12 8"
  className="animate-pulse"
/>

    {routeNodes.map((node, index) => {
      const point = routeCoordinates[node];

      if (!point) return null;

      return (
        <g key={`${node}-${index}`}>
         <circle
  cx={point.x}
  cy={point.y}
  r={
    index === 0
      ? 14
      : node === routeNodes[routeNodes.length - 1]
      ? 16
      : 10
  }
  fill={
    index === 0
      ? "#F59E0B"
      : node === routeNodes[routeNodes.length - 1]
      ? "#22C55E"
      : "#2563EB"
  }
  stroke="white"
  strokeWidth="3"
/>
          <text
  x={point.x}
  y={point.y - 22}
  fontSize="12"
  textAnchor="middle"
  fontWeight="bold"
  fill={
    index === 0
      ? "#F59E0B"
      : node === routeNodes[routeNodes.length - 1]
      ? "#22C55E"
      : "white"
  }
>
  {index === 0
    ? "START"
    : node === routeNodes[routeNodes.length - 1]
    ? "DESTINATION"
    : node.replaceAll("_", " ")}
</text>
        </g>
      );
    })}
  </svg>
)}
            {/* GRID */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* ROADS */}
            <div className="absolute left-[8%] right-[8%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-slate-700/60" />

            <div className="absolute bottom-[8%] left-1/2 top-[8%] w-8 -translate-x-1/2 rounded-full bg-slate-700/60" />

            {/* MAIN BLOCK */}
            <div className="absolute left-[8%] top-[12%] rounded-xl border border-blue-400/30 bg-slate-800/95 p-4">
              <Building2 className="mb-2 h-6 w-6 text-blue-400" />

              <p className="text-sm font-bold">
                Main Block
              </p>

              <p className="text-[10px] text-slate-400">
                Administration
              </p>
            </div>

            {/* LIBRARY */}
            <div className="absolute right-[8%] top-[12%] rounded-xl border border-purple-400/30 bg-slate-800/95 p-4">
              <Library className="mb-2 h-6 w-6 text-purple-400" />

              <p className="text-sm font-bold">
                Library
              </p>

              <p className="text-[10px] text-slate-400">
                Central Library
              </p>
            </div>

            {/* BLOCK A */}
            <div className="absolute bottom-[12%] left-[8%] rounded-xl border border-emerald-400/30 bg-slate-800/95 p-4">
              <Building2 className="mb-2 h-6 w-6 text-emerald-400" />

              <p className="text-sm font-bold">
                Block A
              </p>

              <p className="text-[10px] text-slate-400">
                Engineering
              </p>
            </div>

            {/* BLOCK B */}
            <div className="absolute bottom-[12%] right-[8%] rounded-xl border border-orange-400/30 bg-slate-800/95 p-4">
              <Building2 className="mb-2 h-6 w-6 text-orange-400" />

              <p className="text-sm font-bold">
                Block B
              </p>

              <p className="text-[10px] text-slate-400">
                Academic Block
              </p>
            </div>

            {/* CURRENT LOCATION */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/40">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3">
              <p className="text-xs font-semibold">
                SJEC Campus
              </p>

              <p className="text-[11px] text-slate-400">
                Mangaluru, Karnataka
              </p>
            </div>

            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-slate-900/90 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-300">
                Campus Open
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;