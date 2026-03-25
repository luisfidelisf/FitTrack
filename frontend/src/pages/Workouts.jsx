import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getWorkouts, createWorkout, deleteWorkout } from "../services/workouts";
import { getExercises } from "../services/exercises";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [workoutsData, exercisesData] = await Promise.all([
        getWorkouts(),
        getExercises(),
      ]);
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
    setSelectedExercises([
      ...selectedExercises,
      { exercise_id: "", sets: "", reps: "", weight: "", rest_seconds: "" },
    ]);
  }

  function removeExercise(index) {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  }

  function handleExerciseChange(index, field, value) {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createWorkout({
        ...form,
        exercises: selectedExercises.map((ex) => ({
          exercise_id: parseInt(ex.exercise_id),
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps),
          weight: ex.weight ? parseFloat(ex.weight) : null,
          rest_seconds: ex.rest_seconds ? parseInt(ex.rest_seconds) : null,
        })),
      });

      setForm({ name: "", description: "" });
      setSelectedExercises([]);
      setShowForm(false);
      loadData();
    } catch {
      setError("Erro ao criar treino.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja deletar esse treino?")) return;
    await deleteWorkout(id);
    loadData();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Treinos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancelar" : "+ Novo treino"}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Novo treino</h3>

            {error && (
              <div className="bg-red-500 text-white text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Nome do treino</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ex: Treino A - Peito e Tríceps"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">Descrição (opcional)</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="ex: Foco em empurrar"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Exercícios do treino */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-sm">Exercícios</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-blue-400 hover:text-blue-300 text-sm transition"
                  >
                    + Adicionar exercício
                  </button>
                </div>

                {selectedExercises.map((ex, index) => (
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
                        <label className="text-gray-400 text-xs mb-1 block">Séries</label>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                          placeholder="4"
                          required
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Repetições</label>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                          placeholder="10"
                          required
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Carga (kg)</label>
                        <input
                          type="number"
                          value={ex.weight}
                          onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                          placeholder="60"
                          className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Descanso (seg)</label>
                        <input
                          type="number"
                          value={ex.rest_seconds}
                          onChange={(e) => handleExerciseChange(index, "rest_seconds", e.target.value)}
                          placeholder="90"
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
                Salvar treino
              </button>
            </form>
          </div>
        )}

        {/* Lista de treinos */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : workouts.length === 0 ? (
          <p className="text-gray-400">Nenhum treino criado ainda.</p>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-gray-800 rounded-xl px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{workout.name}</p>
                    {workout.description && (
                      <p className="text-gray-400 text-sm">{workout.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    Deletar
                  </button>
                </div>

                {/* Exercícios do treino */}
                {workout.exercises.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {workout.exercises.map((ex) => (
                      <div key={ex.id} className="bg-gray-700 rounded-lg px-4 py-2 flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{ex.exercise.name}</span>
                        <span className="text-gray-400 text-sm">
                          {ex.sets}x{ex.reps} {ex.weight ? `— ${ex.weight}kg` : ""}
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