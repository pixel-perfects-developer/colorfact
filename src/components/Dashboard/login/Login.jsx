"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Dummy credentials
    const DUMMY_EMAIL = "mark@gmail.com";
    const DUMMY_PASSWORD = "mark@123";

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      // ✅ COOKIE SET (middleware read karegi)
      document.cookie = "isLogin=true; path=/";

      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f4] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#f1e6e2] shadow-sm p-8">
        
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Portal Login
          </h2>
          <p className="text-gray-500 mt-1">
            Sign in to continue
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="gmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-3 py-[10px]
                border border-gray-300 rounded-md
                text-sm
                focus:outline-none focus:ring-2 focus:ring-[#eea9ab]
                focus:border-[#eea9ab]
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-3 py-[10px]
                border border-gray-300 rounded-md
                text-sm
                focus:outline-none focus:ring-2 focus:ring-[#eea9ab]
                focus:border-[#eea9ab]
              "
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="btn-pink w-full mt-2"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
