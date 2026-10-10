import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  me,
} from "../services/authService";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("campusmart_token"))
      me()
        .then((r) => setUser(r.data.data.user))
        .catch(() => localStorage.removeItem("campusmart_token"))
        .finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (d) => {
    const r = await loginApi(d);
    localStorage.setItem("campusmart_token", r.data.data.token);
    setUser(r.data.data.user);
    return r;
  };
  const register = registerApi;
  const logout = () => {
    localStorage.removeItem("campusmart_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
