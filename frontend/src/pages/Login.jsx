import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      saveUser({ email: form.email }, data.access_token);
      navigate("/");
    } catch {
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      {/* Glow de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Fit</span>
            <span className="text-white">Track</span>
          </h1>
          <p className="text-gray-500 mt-1">Entre na sua conta</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Não tem conta?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}