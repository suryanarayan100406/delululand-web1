"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("messages").insert({
      content: message,
      user_id: user.id,
    });

    setMessage("");
    loadMessages();
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
        <button className="px-4 rounded bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
}
