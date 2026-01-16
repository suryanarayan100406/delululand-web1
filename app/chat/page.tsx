"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Load error:", error);
      return;
    }

    setMessages(data ?? []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user session");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: message,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      setLoading(false);
      return;
    }

    // ✅ Optimistically add message to UI
    setMessages((prev) => [...prev, data]);
    setMessage("");
    setLoading(false);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="bg-zinc-800 p-3 rounded">
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded bg-zinc-900 border border-zinc-700"
        />
        <button
          disabled={loading}
          className="px-4 rounded bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
