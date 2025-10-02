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

  const fetchModelos = async () => {
    const res = await api.get<Modelo[]>("/api/modelo");
    setModelos(res.data);
  };

  const fetchMarcas = async () => {
    const res = await api.get<Marca[]>("/api/marca");
    setMarcas(res.data);
  };

  const handleCreate = async () => {
    if (!novoMarcaId || !novoNome || !novoValor) return;
    await api.post("/api/modelo", {
      nome: novoNome,
      valor_fipe: Number(novoValor),
      marca:{
        id: novoMarcaId
      } ,
    });
    setNovoNome("");
    setNovoValor("");
    setNovoMarcaId(undefined);
    setIsModalOpen(false);
    fetchModelos();
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
          </tr>
        </thead>
        <tbody>
          {modelosFiltrados.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border-b">{m.id}</td>
              <td className="p-2 border-b">{m.nome}</td>
              <td className="p-2 border-b">{m.valor_fipe}</td>
              <td className="p-2 border-b">{m.marca.nome_marca}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">Novo Modelo</h3>
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

export default Modelos;
