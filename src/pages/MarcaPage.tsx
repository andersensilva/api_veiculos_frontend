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
  const [editingMarcaId, setEditingMarcaId] = useState<number | null>(null);

  const fetchMarcas = async () => {
    const res = await api.get<Marca[]>("/api/marca");
    setMarcas(res.data);
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!novoNome.trim()) return;

    if (editingMarcaId) {
      // Atualiza marca existente
      await api.put(`/api/marca/${editingMarcaId}`, { nome_marca: novoNome });
    } else {
      // Cria nova marca
      await api.post("/api/marca", { nome_marca: novoNome });
    }

    setNovoNome("");
    setEditingMarcaId(null);
    setIsModalOpen(false);
    fetchMarcas();
  };

  const handleEdit = (marca: Marca) => {
    setEditingMarcaId(marca.id);
    setNovoNome(marca.nome_marca);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Primeiro verifica se há vínculos
      const check = await api.get<{ modelosVinculados: number }>(`/api/marca/${id}/check`);
      const count = check.data.modelosVinculados;

      let cascade = false;
      if (count > 0) {
        cascade = window.confirm(
          `Existem ${count} modelos vinculados a esta marca. Deseja excluir tudo em cascade?`
        );
      }

      // Deleta
      await api.delete(`/api/marca/${id}?cascade=${cascade}`);
      fetchMarcas();
    } catch (err) {
      alert("Erro ao excluir a marca: " + err);
    }
  };

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
            <th className="text-left p-2 border-b">Ação</th>
          </tr>
        </thead>
        <tbody>
          {marcasFiltradas.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border-b">{m.id}</td>
              <td className="p-2 border-b">{m.nome_marca}</td>
              <td className="p-2 border-b">
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(m)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(m.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">
              {editingMarcaId ? "Editar Marca" : "Nova Marca"}
            </h3>
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
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMarcaId(null);
                  setNovoNome("");
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
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
