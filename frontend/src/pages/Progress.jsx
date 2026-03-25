import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSessions, createSession, deleteSession } from "../services/progress";
import { getWorkouts } from "../services/workouts";
import { getExercises } from "../services/exercises";

export default function Progress() {
  const [sessions, setSessions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ workout_id: "", notes: "" });
  const [sessionExercises, setSessionExercises] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sessionsData, workoutsData, exercisesData] = await Promise.all([
        getSessions(),
        getWorkouts(),
        getExercises(),
      ]);
      setSessions(sessionsData);
      setWorkouts(workoutsData);
      setExercises(exercisesData);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addExercise() {
    setSessionExercises([
      ...sessionExercises,
      { exercise_id: "", sets_done: "", reps_done: "", weight_used: "", notes: "" },
    ]);
  }

  function removeExercise(index) {
    setSessionExercises(sessionExercises.filter((_, i) => i !== index));
  }

  function handleExerciseChange(index, field, value) {
    const updated = [...sessionExercises];
    updated[index][field] = value;
    setSessionExercises(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createSession({
        workout_id: parseInt(form.workout_id),
        notes: form.notes || null,
        exercises: sessionExercises.map((ex) => ({
          exercise_id: parseInt(ex.exercise_id),
          sets_done: parseInt(ex.sets_done),
          reps_done: parseInt(ex.reps_done),
          weight_used: ex.weight_used ? parseFloat(ex.weight_used) : null,
          notes: ex.notes || null,
        })),
      });

      setForm({ workout_id: "", notes: "" });
      setSessionExercises([]);
      setShowForm(false);
      loadData();
    } catch {
      setError("Erro ao registrar sessão.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja deletar essa sessão?")) return;
    await deleteSession(id);
    loadData();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Progresso</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancelar" : "+ Registrar sessão"}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Nova sessão</h3>

            {error && (
              <div className="bg-red-500 text-white text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Treino realizado</label>
                <select
                  name="workout_id"
                  value={form.workout_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o treino...</option>
                  {workouts.map((workout) => (
                    <option key={workout.id} value={workout.id}>
                      {workout.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">Observações (opcional)</label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="ex: Treino pesado, boa energia hoje"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Exercícios da sessão */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-sm">Exercícios realizados</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-blue-400 hover:text-blue-300 text-sm transition"
                  >
                    + Adicionar exercício
                  </button>
                </div>

                {sessionExercises.map((ex, index) => (
                  <div key={index} className="bg-gray-700 rounded-xl p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Exercício {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    </div>

                    <select
                      value={ex.exercise_id}
                      onChange={(e) => handleExerciseChange(index, "exercise_id", e.target.value)}
                      required
                      className="w-full bg-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione o exercício...</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name} — {exercise.muscle_group}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Séries feitas</label>
                        <input
                          type="number"
                          value={ex.sets_done}
                          onChange={(e) => handleExerciseChange(index, "sets_done", e.target.value)}
                          placeholder="4"
                          required
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Repetições feitas</label>
                        <input
                          type="number"
                          value={ex.reps_done}
                          onChange={(e) => handleExerciseChange(index, "reps_done", e.target.value)}
                          placeholder="10"
                          required
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Carga usada (kg)</label>
                        <input
                          type="number"
                          value={ex.weight_used}
                          onChange={(e) => handleExerciseChange(index, "weight_used", e.target.value)}
                          placeholder="60"
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Observação</label>
                        <input
                          type="text"
                          value={ex.notes}
                          onChange={(e) => handleExerciseChange(index, "notes", e.target.value)}
                          placeholder="ex: aumentei 5kg"
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Salvar sessão
              </button>
            </form>
          </div>
        )}

        {/* Lista de sessões */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-400">Nenhuma sessão registrada ainda.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-gray-800 rounded-xl px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">
                      Treino #{session.workout_id}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(session.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {session.notes && (
                      <p className="text-gray-400 text-sm mt-1">{session.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    Deletar
                  </button>
                </div>

                {/* Exercícios da sessão */}
                {session.exercises.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {session.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="bg-gray-700 rounded-lg px-4 py-2 flex items-center justify-between"
                      >
                        <span className="text-gray-300 text-sm">{ex.exercise.name}</span>
                        <span className="text-gray-400 text-sm">
                          {ex.sets_done}x{ex.reps_done}
                          {ex.weight_used ? ` — ${ex.weight_used}kg` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}