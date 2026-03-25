import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getExercises, createExercise, deleteExercise } from "../services/exercises";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", muscle_group: "", description: "" });

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    try {
      const data = await getExercises();
      setExercises(data);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createExercise(form);
      setForm({ name: "", muscle_group: "", description: "" });
      setShowForm(false);
      loadExercises();
    } catch {
      setError("Erro ao criar exercício.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja deletar esse exercício?")) return;
    await deleteExercise(id);
    loadExercises();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Exercícios</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancelar" : "+ Novo exercício"}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Novo exercício</h3>

            {error && (
              <div className="bg-red-500 text-white text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ex: Supino Reto"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">Grupo muscular</label>
                <select
                  name="muscle_group"
                  value={form.muscle_group}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Peito">Peito</option>
                  <option value="Costas">Costas</option>
                  <option value="Ombro">Ombro</option>
                  <option value="Bíceps">Bíceps</option>
                  <option value="Tríceps">Tríceps</option>
                  <option value="Perna">Perna</option>
                  <option value="Abdômen">Abdômen</option>
                  <option value="Glúteo">Glúteo</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">Descrição (opcional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Instruções de execução..."
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Salvar exercício
              </button>
            </form>
          </div>
        )}

        {/* Lista de exercícios */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : exercises.length === 0 ? (
          <p className="text-gray-400">Nenhum exercício cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{exercise.name}</p>
                  <p className="text-blue-400 text-sm">{exercise.muscle_group}</p>
                  {exercise.description && (
                    <p className="text-gray-400 text-sm mt-1">{exercise.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition"
                >
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}