import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../hocks/useAuth";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { save } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

        const res = await api.post("/auth/login", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log(res)
      const { token } = res.data;
      console.log("Token recebido do servidor:", token);
      save({token});
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao autenticar");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
