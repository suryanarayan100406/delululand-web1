"use client";

import { useState } from "react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/.netlify/functions/sendInvite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      setMessage("🎉 Invite sent! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={sendInvite}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Join Delululand ✨</h1>

        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
        />

        <button
          disabled={loading}
          className="w-full p-3 rounded bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>

        {message && (
          <p className="text-center text-sm opacity-90">{message}</p>
        )}
      </form>
    </div>
  );
}
