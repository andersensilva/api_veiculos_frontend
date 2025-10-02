import { useEffect, useState } from "react";
import api from "../services/api";

interface Marca {
  id: number;
  nome_marca: string;
}

const Marcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filterNome, setFilterNome] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  const fetchMarcas = async () => {
    const res = await api.get<Marca[]>("/api/marca");
    setMarcas(res.data);
  };

  const handleCreate = async () => {
    if (!novoNome.trim()) return; // validação
    await api.post("/api/marca", { nome_marca: novoNome });
    setNovoNome("");
    setIsModalOpen(false);
    fetchMarcas();
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // Aplica filtro
  const marcasFiltradas = marcas.filter((m) =>
    m.nome_marca.toLowerCase().includes(filterNome.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Marcas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Adicionar
        </button>
      </div>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Filtrar por nome"
        value={filterNome}
        onChange={(e) => setFilterNome(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Tabela */}
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Nome</th>
          </tr>
        </thead>
        <tbody>
          {marcasFiltradas.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border-b">{m.id}</td>
              <td className="p-2 border-b">{m.nome_marca}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">Nova Marca</h3>
            <input
              type="text"
              placeholder="Nome da marca"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreate}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marcas;
