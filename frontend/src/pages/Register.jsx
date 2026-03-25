import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    goal: "",
  });
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
      await register({
        ...form,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
      });
      navigate("/login");
    } catch (err) {
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-10">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo */}
        <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Fit</span>
            <span className="text-white">Track</span>
        </h1>
          <p className="text-gray-500 mt-2">Crie sua conta</p>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campos opcionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Peso (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="70"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Altura (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="175"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Objetivo</label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option value="ganhar massa">Ganhar massa</option>
              <option value="emagrecer">Emagrecer</option>
              <option value="manter forma">Manter forma</option>
              <option value="melhorar condicionamento">Melhorar condicionamento</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {/* Link para login */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}