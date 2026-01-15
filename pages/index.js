// pages/index.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function signInWithEmail(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMsg(error.message);
    else setMsg('Check your email for the magic link!');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Delululand — test login</h1>
      <form onSubmit={signInWithEmail}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
        />
        <button type="submit">Send magic link</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
