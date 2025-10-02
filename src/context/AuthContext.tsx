import { useState, useEffect, createContext } from "react";
import type { ReactNode } from "react";

type UserApiResponse = {
  token: string;
};

type AuthContextType = {
  session: UserApiResponse | null;
  save: (data: UserApiResponse) => void;
  removeUser: () => void;
};

const LOCAL_STORAGE_KEY = "tokenApi";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserApiResponse | null>(null);
  const [loading, setLoading] = useState(true); // Para aguardar carregamento do localStorage

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (token && token !== "null") {
      setSession({ token });
    }
    setLoading(false);
  }, []);

  function save(data: UserApiResponse) {
    localStorage.setItem(LOCAL_STORAGE_KEY, data.token);
    setSession(data);
  }

  function removeUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSession(null);
    window.location.assign("/auth/login");
  }

  return (
    <AuthContext.Provider value={{ session, save, removeUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
