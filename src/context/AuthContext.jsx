// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null); // 👈 DAS exportieren wir explizit!

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // beim Start prüfen, ob schon User gespeichert ist
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function login(email, password) {
    try {
      const res = await fetch("http://52071041.swh.strato-hosting.eu/habito/auth.php?type=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login fehlgeschlagen");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Willkommen zurück 👋");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function register(email, password) {
    try {
      const res = await fetch("http://52071041.swh.strato-hosting.eu/habito/auth.php?type=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registrierung fehlgeschlagen");
      toast.success("Registrierung erfolgreich 🎉");
    } catch (err) {
      toast.error(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}