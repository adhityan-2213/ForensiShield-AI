import { useState } from "react";
import { sendChatMessage } from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendMessage(event) {
    event.preventDefault();

    const question = message.trim();

    if (!question || isLoading) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        text: question,
      },
    ]);

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const answer = await sendChatMessage(question);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: answer,
        },
      ]);
    } catch (error) {
      setError(error.message || "Unable to get an AI response.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      id="ai-assistant"
      className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">ForensiShield AI Assistant</h2>
        <p className="mt-2 text-sm text-slate-400">Ask questions about cybersecurity, log analysis, and digital forensics.</p>
      </div>

      <div
        className="mb-5 flex min-h-64 flex-col gap-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.length === 0 && (
          <div className="m-auto max-w-md py-8 text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">
              🛡️
            </div>

            <h3 className="font-semibold text-white">How can I help with your investigation</h3>
            <p className="mt-2 text-sm text-slate-400">Try asking: What is a brute-force attack?</p>
          </div>
        )}

        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`max-w-[90%] whitespace-pre-wrap break-words rounded-xl p-3 text-sm leading-6 sm:max-w-[80%] ${
              item.role === "user"
                ? "self-end bg-cyan-700 text-white"
                : "self-start border border-slate-700 bg-slate-800 text-slate-100"
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">{item.role === "user" ? "You" : "ForensiShield AI"}</p>

            {item.text}
          </div>
        ))}

        {isLoading && (
          <p className="self-start rounded-lg bg-slate-800 px-3 py-2 text-sm text-cyan-300">AI is thinking...</p>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>
      )}

      <form onSubmit={handleSendMessage} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="ai-chat-message" className="sr-only">Ask a cybersecurity question</label>
        <input
          id="ai-chat-message"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask a cybersecurity question..."
          maxLength={4000}
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">AI-generated responses may contain errors. Verify findings against actual evidence before making forensic conclusions.</p>
    </section>
  );
}

export default AIChat;