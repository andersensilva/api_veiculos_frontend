import { use, useEffect, useState } from "react";
import api from "../services/api";

interface CarroDetalhe {
  id: number;
  timestamp_cadastro: number;
  modelo_id: number;
  ano: number;
  combustivel: string;
  num_portas: number;
  cor: string;
  nome_modelo: string;
  valor: string;
}

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

const Carros = () => {
  const [carros, setCarros] = useState<CarroDetalhe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoModeloId, setNovoModeloId] = useState<number | undefined>();
  const [novoAno, setNovoAno] = useState("");
  const [novoCombustivel, setNovoCombustivel] = useState("");
  const [novoPortas, setNovoPortas] = useState("");
  const [novoCor, setNovoCor] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [novoMarcaId, setNovoMarcaId] = useState<number | undefined>();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filterNome, setFilterNome] = useState("");
  const [filterAno, setFilterAno] = useState("");
  const [filterCor, setFilterCor] = useState("");
  

  const fetchCarros = async () => {
    const res = await api.get<{ cars: CarroDetalhe[] }>("/api/carros-detalhes");
    setCarros(res.data.cars);
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  useEffect(() => {
    fetchModelos();
    fetchMarcas();
  }, [isModalOpen]);

  const fetchModelos = async () => {
    const res = await api.get<Modelo[]>("/api/modelo");
    setModelos(res.data);
  };

  const fetchMarcas = async () => {
    const res = await api.get<Marca[]>("/api/marca");
    setMarcas(res.data);
};

  const handleCreateCarro = async () => {
    if (!novoModeloId || !novoAno || !novoCombustivel || !novoPortas || !novoCor || !novoValor) return;

    await api.post("/api/carros", {
      modelo: {
        id: novoModeloId
      },
      ano: Number(novoAno),
      combustivel: novoCombustivel,
      num_portas: Number(novoPortas),
      cor: novoCor,
      valor: novoValor,
    });

    // limpa os campos
    setNovoModeloId(undefined);
    setNovoAno("");
    setNovoCombustivel("");
    setNovoPortas("");
    setNovoCor("");
    setNovoValor("");
    setIsModalOpen(false);

    

    fetchCarros(); // Recarrega a lista
  };


  const carrosFiltrados = carros.filter((c) => {
    return (
      (!filterNome || c.nome_modelo.toLowerCase().includes(filterNome.toLowerCase())) &&
      (!filterAno || c.ano === Number(filterAno)) &&
      (!filterCor || c.cor.toLowerCase().includes(filterCor.toLowerCase()))
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Carros</h2>
      <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
      >
          + Adicionar
      </button>
      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Modelo"
          value={filterNome}
          onChange={(e) => setFilterNome(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Ano"
          value={filterAno}
          onChange={(e) => setFilterAno(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <input
          type="text"
          placeholder="Cor"
          value={filterCor}
          onChange={(e) => setFilterCor(e.target.value)}
          className="border p-2 rounded w-32"
        />
      </div>

      {/* Tabela */}
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Modelo</th>
            <th className="text-left p-2 border-b">Ano</th>
            <th className="text-left p-2 border-b">Combustível</th>
            <th className="text-left p-2 border-b">Portas</th>
            <th className="text-left p-2 border-b">Cor</th>
            <th className="text-left p-2 border-b">Valor</th>
          </tr>
        </thead>
        <tbody>
          {carrosFiltrados.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border-b">{c.id}</td>
              <td className="p-2 border-b">{c.nome_modelo}</td>
              <td className="p-2 border-b">{c.ano}</td>
              <td className="p-2 border-b">{c.combustivel}</td>
              <td className="p-2 border-b">{c.num_portas}</td>
              <td className="p-2 border-b">{c.cor}</td>
              <td className="p-2 border-b">{c.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de criação de carro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">Novo Carro</h3>

            <select
              value={novoModeloId ?? ""}
              onChange={(e) => setNovoModeloId(Number(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Selecione modelo</option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} - R${m.valor_fipe}
                </option>
              ))}
            </select>

            <select
              value={novoMarcaId ?? ""}
              onChange={(e) => setNovoMarcaId(Number(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Selecione marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome_marca}
                </option>
              ))}
            </select>


            <input
              type="number"
              placeholder="Ano"
              value={novoAno}
              onChange={(e) => setNovoAno(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="text"
              placeholder="Combustível"
              value={novoCombustivel}
              onChange={(e) => setNovoCombustivel(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="number"
              placeholder="Número de portas"
              value={novoPortas}
              onChange={(e) => setNovoPortas(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="text"
              placeholder="Cor"
              value={novoCor}
              onChange={(e) => setNovoCor(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="text"
              placeholder="Valor"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
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
                onClick={handleCreateCarro} // Função que envia os dados para o backend
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

export default Carros;
