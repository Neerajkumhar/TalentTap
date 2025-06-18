import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg material-elevation-2">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center mb-2">
            <span className="material-icons text-white text-2xl">work</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign In to TalentTap</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Please enter your details.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white text-base py-2 rounded">Sign In</Button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
