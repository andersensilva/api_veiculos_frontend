import { useEffect, useState } from "react";
import api from "../services/api";

interface Modelo {
  id: number;
  nome: string;
  valor_fipe: number;
  marca: Marca;
}

interface Marca {
  id: number;
  nome_marca: string;
}

const Modelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  // filtros
  const [filterNome, setFilterNome] = useState("");
  const [filterMarcaId, setFilterMarcaId] = useState<number | "">("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoMarcaId, setNovoMarcaId] = useState<number | undefined>();
  const [editingModeloId, setEditingModeloId] = useState<number | null>(null);

  const fetchModelos = async () => {
    const res = await api.get<Modelo[]>("/api/modelo");
    setModelos(res.data);
  };

  const fetchMarcas = async () => {
    const res = await api.get<Marca[]>("/api/marca");
    setMarcas(res.data);
  };

  useEffect(() => {
    fetchMarcas();
    fetchModelos();
  }, []);

  // filtros aplicados
  const modelosFiltrados = modelos.filter((m) => {
    const matchesNome =
      !filterNome || m.nome.toLowerCase().includes(filterNome.toLowerCase());

    const matchesMarca =
      !filterMarcaId || m.marca?.id === filterMarcaId;

    return matchesNome && matchesMarca;
  });

  const handleSaveModelo = async () => {
    if (!novoMarcaId || !novoNome || !novoValor) return;

    const payload = {
      nome: novoNome,
      valor_fipe: Number(novoValor),
      marca: { id: novoMarcaId },
    };

    try {
      if (editingModeloId) {
        await api.put(`/api/modelo/${editingModeloId}`, payload);
      } else {
        await api.post("/api/modelo", payload);
      }

      setNovoNome("");
      setNovoValor("");
      setNovoMarcaId(undefined);
      setEditingModeloId(null);
      setIsModalOpen(false);
      fetchModelos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (modelo: Modelo) => {
    setEditingModeloId(modelo.id);
    setNovoNome(modelo.nome);
    setNovoValor(modelo.valor_fipe.toString());
    setNovoMarcaId(modelo.marca.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await api.get<number>(`/api/modelo/${id}/check-carros`);
      const qtd = res.data;

      let confirmMsg = "Tem certeza que deseja excluir este modelo?";
      if (qtd > 0) {
        confirmMsg = `Existem ${qtd} carro(s) vinculados a este modelo. Deseja excluir o modelo e todos os carros vinculados?`;
      }

      if (!window.confirm(confirmMsg)) return;

      await api.delete(`/api/modelo/${id}?cascade=${qtd > 0}`);
      fetchModelos();
    } catch (err: any) {
      alert("Erro ao excluir modelo");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Modelos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Adicionar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={filterNome}
          onChange={(e) => setFilterNome(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterMarcaId}
          onChange={(e) =>
            setFilterMarcaId(e.target.value ? Number(e.target.value) : "")
          }
          className="border p-2 rounded"
        >
          <option value="">Todas as marcas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome_marca}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela de modelos */}
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Nome</th>
            <th className="text-left p-2 border-b">Valor FIPE</th>
            <th className="text-left p-2 border-b">Marca</th>
            <th className="text-left p-2 border-b">Ação</th>
          </tr>
        </thead>
        <tbody>
          {modelosFiltrados.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border-b">{m.id}</td>
              <td className="p-2 border-b">{m.nome}</td>
              <td className="p-2 border-b">{m.valor_fipe}</td>
              <td className="p-2 border-b">{m.marca.nome_marca}</td>
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

      {/* Modal de criação/edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">
              {editingModeloId ? "Editar Modelo" : "Novo Modelo"}
            </h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Valor FIPE"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <select
              value={novoMarcaId ?? ""}
              onChange={(e) => setNovoMarcaId(Number(e.target.value))}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">Selecione marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome_marca}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingModeloId(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveModelo}
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

export default Modelos;
