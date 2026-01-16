"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserEmail(session.user.email ?? null);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-4 border-b border-zinc-800">
        <span className="text-sm opacity-80">{userEmail}</span>
        <button
          onClick={logout}
          className="text-sm px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          Logout
        </button>
      </header>

      <main>{children}</main>
    </div>
  );
}
