import React, { useEffect, useState } from "react";

interface Car {
  id: number;
  nome_modelo: string;
  valor: number;
  combustivel: string;
  marca_nome: string;
  ano: number;
  num_portas: number;
  cor: string;
}

type GroupedCars = Record<string, Car[]>;

const Carros: React.FC = () => {
  const [groupedCars, setGroupedCars] = useState<GroupedCars>({});
  const [useGroupedApi, setUseGroupedApi] = useState(true);

  const fetchData = async () => {
    try {
      const url = useGroupedApi
        ? "/api/cars_by_brand"
        : "/api/cars";

      const res = await fetch(url);
      let text = await res.text(); 

      text = text.replace(/"num_portas"\s*:\s*(\d+)\s*"cor"/g, '"num_portas": $1, "cor"');

      text = text.replace(/"valor"\s*:\s*(\d+)\.(\d{3})/g, (_, intPart, decimalPart) => {
        return `"valor": ${intPart}${decimalPart}`;
      });
      const data = JSON.parse(text);
      if (useGroupedApi) {
        
        setGroupedCars(data);
      } else {
        const grouped = (data.cars as Car[]).reduce<GroupedCars>((acc, car) => {
          if (!acc[car.marca_nome]) acc[car.marca_nome] = [];
          acc[car.marca_nome].push(car);
          return acc;
        }, {});
        setGroupedCars(grouped);
      }
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [useGroupedApi]);

 const formatValor = (valor: number | undefined | null) => {
  if (valor == null) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Veículos</h1>

      <div className="mb-4">
        <label className="mr-2">Fonte de dados:</label>
        <select
          value={useGroupedApi ? "grouped" : "all"}
          onChange={(e) => setUseGroupedApi(e.target.value === "grouped")}
          className="border rounded p-2"
        >
          <option value="grouped">Agrupado por marca</option>
          <option value="all">Lista simples</option>
        </select>
      </div>

      {Object.keys(groupedCars).map((marca) => (
        <div key={marca} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{marca}</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Modelo</th>
                <th className="border p-2">Ano</th>
                <th className="border p-2">Combustível</th>
                <th className="border p-2">Portas</th>
                <th className="border p-2">Cor</th>
                <th className="border p-2">Valor FIPE</th>
              </tr>
            </thead>
            <tbody>
              {groupedCars[marca].map((car) => (
                <tr key={car.id}>
                  <td className="border p-2">{car.nome_modelo}</td>
                  <td className="border p-2">{car.ano}</td>
                  <td className="border p-2">{car.combustivel}</td>
                  <td className="border p-2">{car.num_portas}</td>
                  <td className="border p-2">{car.cor}</td>
                  <td className="border p-2">{formatValor(car.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Carros;
