"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/chat`,
      },
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("📩 Check your email for the login link!");
      setEmail("");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={signIn}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Welcome back ✨</h1>

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
          className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Send magic link"}
        </button>

        {message && (
          <p className="text-center text-sm opacity-90">{message}</p>
        )}
      </form>
    </div>
  );
}
