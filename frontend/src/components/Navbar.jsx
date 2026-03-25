import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path
      ? "text-blue-400 font-semibold"
      : "text-gray-400 hover:text-white transition";
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Fit</span>
            <span className="text-white">Track</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className={isActive("/")}>Inicial</Link>
          <Link to="/exercises" className={isActive("/exercises")}>Exercícios</Link>
          <Link to="/workouts" className={isActive("/workouts")}>Treinos</Link>
          <Link to="/progress" className={isActive("/progress")}>Progresso</Link>
        </div>

        {/* Usuário e logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <span className="text-gray-300 text-sm">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition border border-gray-700"
          >
            Sair
          </button>
        </div>

      </div>
    </nav>
  );
}