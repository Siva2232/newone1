// src/pages/LoginPage.jsx
import { useState } from "react";
import { useProducts } from "../Context/ProductContext";
import { Package } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated } = useProducts(); // We'll add these to context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Demo credentials
    if (username === "admin" && password === "admin123") {
      login();
    } else {
      setError("Invalid username or password");
    }
  };

  // If already logged in, redirect (optional, handled in routing usually)
  if (isAuthenticated) {
    return null; // Or redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-4">
            <Package size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Manage your store content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition shadow-lg transform hover:scale-105"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
          <p className="font-bold text-gray-800">Demo Credentials:</p>
          <p className="mt-1">
            Username: <span className="font-mono font-bold">admin</span>
            <br />
            Password: <span className="font-mono font-bold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}