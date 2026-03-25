import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getExercises } from "../services/exercises";
import { getWorkouts } from "../services/workouts";
import { getSessions } from "../services/progress";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getExercises().then(setExercises);
    getWorkouts().then(setWorkouts);
    getSessions().then(setSessions);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Boas vindas */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">
            Olá, {user?.name || user?.email?.split("@")[0]}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Aqui está o resumo dos seus treinos.</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Exercícios cadastrados</p>
              <span className="text-2xl">💪</span>
            </div>
            <p className="text-4xl font-bold text-white">{exercises.length}</p>
            <div className="mt-3 h-1 bg-gray-800 rounded-full">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min(exercises.length * 10, 100)}%` }} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Treinos criados</p>
              <span className="text-2xl">🗂️</span>
            </div>
            <p className="text-4xl font-bold text-white">{workouts.length}</p>
            <div className="mt-3 h-1 bg-gray-800 rounded-full">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min(workouts.length * 20, 100)}%` }} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Sessões registradas</p>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-4xl font-bold text-white">{sessions.length}</p>
            <div className="mt-3 h-1 bg-gray-800 rounded-full">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min(sessions.length * 10, 100)}%` }} />
            </div>
          </div>

        </div>

        {/* Últimas sessões */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Últimas sessões</h3>

          {sessions.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">🏃</span>
              <p className="text-gray-500 mt-3">Nenhuma sessão registrada ainda.</p>
              <p className="text-gray-600 text-sm mt-1">Comece registrando seu primeiro treino!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-blue-500/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      {session.workout_id}
                    </div>
                    <div>
                      <p className="text-white font-medium">Treino #{session.workout_id}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(session.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-full">
                    {session.exercises.length} exercício(s)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}