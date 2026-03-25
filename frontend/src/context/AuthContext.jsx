import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Recupera o usuário salvo no localStorage ao carregar a página
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function saveUser(userData, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}