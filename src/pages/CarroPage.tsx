import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
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
  const [editingCarId, setEditingCarId] = useState<number | null>(null);

  // Schema Zod
  const carroSchema = z.object({
    modeloId: z.number().min(1, "Selecione um modelo"),
    ano: z.number().min(1900, "Ano inválido"),
    combustivel: z.string().nonempty("Informe o combustível"),
    numPortas: z.number().min(1, "Número de portas inválido"),
    cor: z.string().nonempty("Informe a cor"),
  });

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



  const handleSaveCarro = async () => {
    try {
      const parsed = carroSchema.parse({
        modeloId: novoModeloId,
        ano: Number(novoAno),
        combustivel: novoCombustivel,
        numPortas: Number(novoPortas),
        cor: novoCor,
        valor: Number(novoValor) / 100, // converte centavos para reais
      });

      if (editingCarId) {
        await api.put(`/api/carros/${editingCarId}`, {
          modelo: { id: parsed.modeloId },
          ano: parsed.ano,
          combustivel: parsed.combustivel,
          num_portas: parsed.numPortas,
          cor: parsed.cor,
        });
      } else {
        await api.post("/api/carros", {
          modelo: { id: parsed.modeloId },
          ano: parsed.ano,
          combustivel: parsed.combustivel,
          num_portas: parsed.numPortas,
          cor: parsed.cor,
        });
      }

      // Limpar modal
      setEditingCarId(null);
      setNovoModeloId(undefined);
      setNovoAno("");
      setNovoCombustivel("");
      setNovoPortas("");
      setNovoCor("");
      setNovoValor("");
      setIsModalOpen(false);
      fetchCarros();

    } catch (err) {
      if (err instanceof ZodError) {
        // extraindo mensagens do Zod
        const messages = err.issues.map(issue => issue.message).join("\n");
        alert(messages);
      } else {
        console.error(err);
      }
    }
  };

  const handleEdit = (carro: CarroDetalhe) => {
    setEditingCarId(carro.id);
    setNovoModeloId(carro.modelo_id);
    setNovoAno(carro.ano.toString());
    setNovoCombustivel(carro.combustivel);
    setNovoPortas(carro.num_portas.toString());
    setNovoCor(carro.cor);
    setNovoValor((carro.valor.replace(/\D/g, "")) || "0");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este carro?")) {
      await api.delete(`/api/carros/${id}`);
      fetchCarros();
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Carros</h2>
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
            <th className="text-left p-2 border-b">Ação</th>
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
              <td className="p-2 border-b">
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(c.id)}
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
            <h3 className="text-xl font-bold mb-4">{editingCarId ? "Editar Carro" : "Novo Carro"}</h3>

            <select
              value={novoModeloId ?? ""}
              onChange={(e) => setNovoModeloId(Number(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Selecione modelo</option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>

            <select
              value={novoMarcaId ?? ""}
              onChange={(e) => setNovoMarcaId(Number(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Selecione marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>{m.nome_marca}</option>
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

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveCarro}
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
